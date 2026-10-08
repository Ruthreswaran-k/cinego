import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Popcorn, Plus, Minus, ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface FoodItem {
  id: number;
  name: string;
  category: 'Snacks' | 'Beverages' | 'Combos';
  price: number;
  description: string;
  isVeg: boolean;
  image: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: 601, name: 'Small Butter Popcorn', category: 'Snacks', price: 120, description: 'Classic salted butter popcorn - small tub', isVeg: true, image: '🍿' },
  { id: 602, name: 'Large Butter Popcorn', category: 'Snacks', price: 200, description: 'Classic salted golden popcorn - large tub', isVeg: true, image: '🍿' },
  { id: 603, name: 'Cheese Popcorn', category: 'Snacks', price: 250, description: 'Crispy popcorn dusted with savory aged cheddar', isVeg: true, image: '🧀' },
  { id: 604, name: 'Nachos with Salsa & Cheese', category: 'Snacks', price: 180, description: 'Warm tortilla chips served with zesty salsa & warm cheese dip', isVeg: true, image: '🌮' },
  { id: 605, name: 'Chicken Sandwich', category: 'Snacks', price: 220, description: 'Smoked chicken breast with herb mayo on grilled sourdough', isVeg: false, image: '🥪' },
  { id: 606, name: 'Veg Crispy Burger', category: 'Snacks', price: 160, description: 'Crispy spiced potato patty topped with cheese & crisp lettuce', isVeg: true, image: '🍔' },
  { id: 607, name: 'Paneer Tikka Wrap', category: 'Snacks', price: 190, description: 'Tandoori marinated paneer with fresh peppers in flatbread', isVeg: true, image: '🌯' },
  { id: 608, name: 'Coca-Cola (500ml)', category: 'Beverages', price: 80, description: 'Chilled refreshing sparkling beverage', isVeg: true, image: '🥤' },
  { id: 609, name: 'Pepsi (500ml)', category: 'Beverages', price: 80, description: 'Ice-cold carbonated refreshment', isVeg: true, image: '🥤' },
  { id: 610, name: 'Mineral Water (1L)', category: 'Beverages', price: 40, description: 'Pure packaged drinking water', isVeg: true, image: '💧' },
  { id: 611, name: 'Combo 1 - Movie Magic', category: 'Combos', price: 280, description: 'Large Tub Popcorn + 2 Chilled Soft Drinks (Save ₹80)', isVeg: true, image: '✨' },
  { id: 612, name: 'Combo 2 - Snack Attack', category: 'Combos', price: 240, description: 'Warm Nachos + Soft Drink + Small Butter Popcorn (Save ₹60)', isVeg: true, image: '🔥' },
];

export const FoodSelection: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Snacks' | 'Beverages' | 'Combos'>('All');
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredItems =
    selectedCategory === 'All' ? FOOD_ITEMS : FOOD_ITEMS.filter((item) => item.category === selectedCategory);

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const foodTotalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const item = FOOD_ITEMS.find((f) => f.id === Number(id));
    return sum + (item ? item.price * count : 0);
  }, 0);

  const saveCartAndProceed = () => {
    const foodOrders = Object.entries(cart).map(([id, quantity]) => {
      const item = FOOD_ITEMS.find((f) => f.id === Number(id))!;
      return {
        id: Number(id),
        name: item.name,
        price: item.price,
        quantity,
        subtotal: item.price * quantity,
      };
    });

    // Update existing booking payload in sessionStorage
    const existing = sessionStorage.getItem('cinego_current_booking');
    if (existing) {
      const parsed = JSON.parse(existing);
      parsed.foodOrders = foodOrders;
      parsed.foodTotal = foodTotalPrice;
      parsed.finalTotal = (parsed.totalAmount || 560) + foodTotalPrice;
      sessionStorage.setItem('cinego_current_booking', JSON.stringify(parsed));
    }

    const targetId = bookingId || '504';
    navigate(`/booking/summary/${targetId}`);
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-32 sm:pt-36 md:pt-40 pb-32 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-primary font-medium text-xs mb-1 uppercase tracking-wider">
              <Popcorn className="w-4 h-4" />
              <span>Concessions & Refreshments</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Cinema Bites & Gourmet Beverages</h1>
            <p className="text-zinc-400 text-sm mt-1">Pre-order freshly prepared snacks delivered directly to your cinema seat.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={saveCartAndProceed} className="text-zinc-400 hover:text-white text-xs">
              Skip Concessions →
            </Button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'Snacks', 'Beverages', 'Combos'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const count = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-4xl p-2 bg-white/5 rounded-xl">{item.image}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.isVeg
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xl font-bold font-display text-white">₹{item.price}</span>
                  {count === 0 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="rounded-full px-4 text-xs font-semibold hover:border-primary hover:text-primary"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  ) : (
                    <div className="flex items-center bg-zinc-800 rounded-full p-1 border border-primary/40">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-bold text-sm text-primary">{count}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-primary hover:bg-red-700 flex items-center justify-center text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Food Service Quality Banner */}
        <div className="mt-12 p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center space-x-3 text-xs text-zinc-400">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Fresh, hygienic theatre snacks and beverages prepared freshly and delivered directly to your seat during intermission.</span>
        </div>
      </div>

      {/* Sticky Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 p-4 z-40 animate-slide-up">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{totalItems} item{totalItems > 1 ? 's' : ''} added to cart</p>
                <p className="text-xl font-bold text-white">₹{foodTotalPrice}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="lg" variant="primary" onClick={saveCartAndProceed} className="rounded-xl px-8 shadow-lg shadow-primary/30">
                Continue to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
