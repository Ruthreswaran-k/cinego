CREATE OR REPLACE FUNCTION CALCULATE_TICKET_PRICE(
    p_show_id NUMBER,
    p_num_seats NUMBER
) RETURN NUMBER IS
    v_base_price NUMBER(10,2);
    v_total NUMBER(10,2);
    v_convenience_fee NUMBER(10,2) := 30;
BEGIN
    SELECT BASE_PRICE INTO v_base_price FROM SHOWS WHERE SHOW_ID = p_show_id;
    v_total := (v_base_price * p_num_seats) + (v_convenience_fee * p_num_seats);
    RETURN v_total;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END CALCULATE_TICKET_PRICE;
/

CREATE OR REPLACE FUNCTION APPLY_COUPON(
    p_coupon_code VARCHAR2,
    p_order_amount NUMBER
) RETURN NUMBER IS
    v_discount_type VARCHAR2(20);
    v_discount_value NUMBER(10,2);
    v_min_order NUMBER(10,2);
    v_max_discount NUMBER(10,2);
    v_usage_limit NUMBER;
    v_used_count NUMBER;
    v_expiry DATE;
    v_is_active NUMBER;
    v_discount_amt NUMBER(10,2) := 0;
    PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
    SELECT DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, USED_COUNT, EXPIRY_DATE, IS_ACTIVE
    INTO v_discount_type, v_discount_value, v_min_order, v_max_discount, v_usage_limit, v_used_count, v_expiry, v_is_active
    FROM COUPONS WHERE CODE = p_coupon_code;
    
    IF v_is_active = 0 OR v_expiry < SYSDATE OR (v_usage_limit IS NOT NULL AND v_used_count >= v_usage_limit) OR p_order_amount < v_min_order THEN
        RETURN p_order_amount;
    END IF;
    
    IF v_discount_type = 'FLAT' THEN
        v_discount_amt := v_discount_value;
    ELSIF v_discount_type = 'PERCENTAGE' THEN
        v_discount_amt := (v_discount_value / 100) * p_order_amount;
        IF v_max_discount IS NOT NULL AND v_discount_amt > v_max_discount THEN
            v_discount_amt := v_max_discount;
        END IF;
    END IF;
    
    UPDATE COUPONS SET USED_COUNT = USED_COUNT + 1 WHERE CODE = p_coupon_code;
    COMMIT;
    
    RETURN GREATEST(p_order_amount - v_discount_amt, 0);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN p_order_amount;
END APPLY_COUPON;
/
