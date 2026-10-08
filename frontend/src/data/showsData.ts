import { ALL_MOVIES, Movie, findMovieByIdOrTitle } from './moviesData';

export interface ShowRecord {
  showId: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  city: string;
  area: string;
  screenName: string;
  showDate: string; // YYYY-MM-DD
  showTime: string; // e.g. "10:30 AM"
  language: string;
  format: string; // 2D, 3D, Dolby Atmos, IMAX 2D, IMAX 3D, 4K Laser, EPIQ
  price: number;
  availableSeats: number;
  totalSeats: number;
  status?: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL';
}

/**
 * Validates that showDate is strictly on or after the movie release date.
 */
export function validateShowtime(releaseDateStr: string, showDateStr: string): boolean {
  if (!releaseDateStr || !showDateStr) return false;
  return showDateStr >= releaseDateStr;
}

/**
 * Calculates live booking status based on available seats
 */
export function calculateLiveStatus(availableSeats: number, totalSeats: number = 85): 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL' {
  if (availableSeats <= 8) return 'ALMOST_FULL';
  if (availableSeats <= 22) return 'FILLING_FAST';
  return 'AVAILABLE';
}

// Master Theatre Catalog for multi-day programmatic scheduling
interface TheatreConfig {
  theatreId: string;
  theatreName: string;
  city: string;
  area: string;
  movieConfigs: {
    movieId: string;
    screenName: string;
    format: string;
    basePrice: number;
    showTimes: string[];
  }[];
}

const THEATRE_CATALOG: TheatreConfig[] = [
  // Puducherry / Pondicherry
  {
    theatreId: '217',
    theatreName: 'PVR INOX',
    city: 'Puducherry',
    area: 'White Town',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Screen 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 220,
        showTimes: ['10:15 AM', '01:30 PM', '04:45 PM', '07:30 PM', '10:15 PM'],
      },
      {
        movieId: 'MOV003', // Anbil Avan
        screenName: 'Screen 2',
        format: '2D',
        basePrice: 190,
        showTimes: ['11:00 AM', '02:15 PM', '06:00 PM', '09:30 PM'],
      },
      {
        movieId: 'MOV025', // Digger
        screenName: 'Screen 3 - 4K Laser',
        format: '2D',
        basePrice: 200,
        showTimes: ['10:45 AM', '03:15 PM', '06:45 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV026', // Street Fighter (Release Oct 09)
        screenName: 'Screen 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 240,
        showTimes: ['12:30 PM', '04:00 PM', '08:15 PM'],
      },
    ],
  },
  {
    theatreId: '218',
    theatreName: 'CinemaVerse',
    city: 'Puducherry',
    area: 'Lawspet',
    movieConfigs: [
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Audi 1 - 4K Laser',
        format: '2D',
        basePrice: 180,
        showTimes: ['10:30 AM', '01:45 PM', '07:00 PM', '10:15 PM'],
      },
      {
        movieId: 'MOV004', // Sigma
        screenName: 'Audi 2',
        format: '2D',
        basePrice: 170,
        showTimes: ['10:00 AM', '01:15 PM', '04:30 PM', '08:00 PM'],
      },
      {
        movieId: 'MOV006', // Idly Kadai
        screenName: 'Audi 3',
        format: '2D',
        basePrice: 160,
        showTimes: ['11:15 AM', '02:30 PM', '06:15 PM', '09:45 PM'],
      },
    ],
  },
  {
    theatreId: '204',
    theatreName: 'SPI Palazzo Pondicherry',
    city: 'Puducherry',
    area: 'ECR',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Audi 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 230,
        showTimes: ['10:30 AM', '02:00 PM', '05:30 PM', '08:45 PM'],
      },
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Audi 2 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 210,
        showTimes: ['11:30 AM', '03:00 PM', '06:30 PM', '09:45 PM'],
      },
      {
        movieId: 'MOV013', // The Third Murder
        screenName: 'Audi 3',
        format: '2D',
        basePrice: 190,
        showTimes: ['10:00 AM', '01:15 PM', '04:45 PM', '08:00 PM'],
      },
    ],
  },

  // Chennai
  {
    theatreId: '201',
    theatreName: 'PVR Grand Mall',
    city: 'Chennai',
    area: 'Velachery',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Audi 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 230,
        showTimes: ['10:15 AM', '01:30 PM', '04:45 PM', '07:45 PM', '10:45 PM'],
      },
      {
        movieId: 'MOV003', // Anbil Avan
        screenName: 'Audi 2',
        format: '2D',
        basePrice: 190,
        showTimes: ['10:45 AM', '02:00 PM', '06:15 PM', '09:30 PM'],
      },
      {
        movieId: 'MOV009', // Vikram
        screenName: 'Audi 3 - 4K Laser',
        format: 'Dolby Atmos',
        basePrice: 210,
        showTimes: ['11:15 AM', '02:45 PM', '07:00 PM', '10:15 PM'],
      },
      {
        movieId: 'MOV010', // Jailer
        screenName: 'Audi 4',
        format: '2D',
        basePrice: 180,
        showTimes: ['01:00 PM', '05:15 PM', '08:30 PM'],
      },
      {
        movieId: 'MOV014', // Jawan
        screenName: 'Audi 5',
        format: '2D',
        basePrice: 190,
        showTimes: ['11:45 AM', '03:15 PM', '06:45 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV025', // Digger
        screenName: 'Audi 6 - 4K Laser',
        format: '2D',
        basePrice: 200,
        showTimes: ['10:30 AM', '02:00 PM', '05:30 PM', '09:00 PM'],
      },
    ],
  },
  {
    theatreId: '203',
    theatreName: 'AGS Cinemas T.Nagar',
    city: 'Chennai',
    area: 'T.Nagar',
    movieConfigs: [
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Screen 1 - 4K Laser',
        format: '2D',
        basePrice: 200,
        showTimes: ['10:30 AM', '02:15 PM', '06:30 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV004', // Sigma
        screenName: 'Screen 2',
        format: '2D',
        basePrice: 180,
        showTimes: ['11:00 AM', '02:30 PM', '07:15 PM'],
      },
      {
        movieId: 'MOV011', // Leo
        screenName: 'Screen 3 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 220,
        showTimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
      },
      {
        movieId: 'MOV014', // Jawan
        screenName: 'Screen 4',
        format: '2D',
        basePrice: 190,
        showTimes: ['12:00 PM', '03:45 PM', '07:30 PM'],
      },
    ],
  },
  {
    theatreId: '208',
    theatreName: 'Rohini Silver Screens',
    city: 'Chennai',
    area: 'Koyambedu',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Screen 1 - Fans Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 240,
        showTimes: ['09:30 AM', '01:00 PM', '04:30 PM', '07:45 PM', '11:00 PM'],
      },
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Screen 2 - RGB Laser',
        format: '2D',
        basePrice: 190,
        showTimes: ['10:45 AM', '02:15 PM', '06:00 PM', '09:30 PM'],
      },
      {
        movieId: 'MOV008', // Retro
        screenName: 'Screen 3',
        format: '2D',
        basePrice: 180,
        showTimes: ['11:15 AM', '03:00 PM', '06:45 PM', '10:15 PM'],
      },
      {
        movieId: 'MOV010', // Jailer
        screenName: 'Screen 4 - Fans Screen',
        format: 'Dolby Atmos',
        basePrice: 220,
        showTimes: ['10:00 AM', '02:00 PM', '07:15 PM'],
      },
    ],
  },
  {
    theatreId: '209',
    theatreName: 'SPI Sathyam Cinemas',
    city: 'Chennai',
    area: 'Royapettah',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Sathyam Screen 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 250,
        showTimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
      },
      {
        movieId: 'MOV003', // Anbil Avan
        screenName: 'Santham Screen 2',
        format: '2D',
        basePrice: 200,
        showTimes: ['10:30 AM', '02:15 PM', '06:00 PM', '09:45 PM'],
      },
      {
        movieId: 'MOV015', // Oppenheimer
        screenName: 'Subham Screen 3 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 260,
        showTimes: ['11:00 AM', '03:30 PM', '07:45 PM'],
      },
      {
        movieId: 'MOV016', // Interstellar
        screenName: 'Studio 5',
        format: 'Dolby Atmos',
        basePrice: 270,
        showTimes: ['01:45 PM', '06:15 PM', '10:00 PM'],
      },
    ],
  },
  {
    theatreId: '210',
    theatreName: 'Luxe Cinemas',
    city: 'Chennai',
    area: 'Velachery',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Audi 1 - IMAX Laser',
        format: 'IMAX 2D',
        basePrice: 320,
        showTimes: ['10:15 AM', '01:45 PM', '05:15 PM', '08:45 PM'],
      },
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Audi 3 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 240,
        showTimes: ['11:00 AM', '02:30 PM', '06:45 PM', '10:15 PM'],
      },
      {
        movieId: 'MOV015', // Oppenheimer
        screenName: 'Audi 1 - IMAX Laser',
        format: 'IMAX 2D',
        basePrice: 350,
        showTimes: ['11:30 AM', '04:00 PM', '08:00 PM'],
      },
      {
        movieId: 'MOV026', // Street Fighter (Release Oct 09)
        screenName: 'Audi 1 - IMAX Laser',
        format: 'IMAX 3D',
        basePrice: 360,
        showTimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
      },
      {
        movieId: 'MOV025', // Digger
        screenName: 'Audi 4 - RealD 3D',
        format: '3D',
        basePrice: 280,
        showTimes: ['11:00 AM', '02:45 PM', '06:15 PM', '09:45 PM'],
      },
    ],
  },

  // Coimbatore
  {
    theatreId: '202',
    theatreName: 'INOX Brookefields',
    city: 'Coimbatore',
    area: 'R.S. Puram',
    movieConfigs: [
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Screen 1 - Dolby 7.1',
        format: '2D',
        basePrice: 190,
        showTimes: ['10:30 AM', '01:45 PM', '06:30 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV003', // Anbil Avan
        screenName: 'Screen 2',
        format: '2D',
        basePrice: 180,
        showTimes: ['11:00 AM', '02:30 PM', '07:15 PM'],
      },
      {
        movieId: 'MOV004', // Sigma
        screenName: 'Screen 3',
        format: '2D',
        basePrice: 170,
        showTimes: ['10:15 AM', '01:30 PM', '05:45 PM', '09:15 PM'],
      },
    ],
  },
  {
    theatreId: '211',
    theatreName: 'Broadway Cinemas',
    city: 'Coimbatore',
    area: 'Avinashi Road',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'EPIQ Screen - Laser Projection',
        format: 'EPIQ',
        basePrice: 280,
        showTimes: ['10:15 AM', '01:45 PM', '05:15 PM', '08:45 PM'],
      },
      {
        movieId: 'MOV002', // Yezhu Kadal Yezhu Malai
        screenName: 'Audi 2 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 220,
        showTimes: ['11:15 AM', '02:45 PM', '06:30 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV026', // Street Fighter (Release Oct 09)
        screenName: 'Audi 3 - IMAX Laser',
        format: 'IMAX 2D',
        basePrice: 320,
        showTimes: ['10:45 AM', '02:15 PM', '06:00 PM', '09:30 PM'],
      },
    ],
  },

  // Bengaluru
  {
    theatreId: '205',
    theatreName: 'PVR Orion Mall',
    city: 'Bengaluru',
    area: 'Rajajinagar',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Audi 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 260,
        showTimes: ['10:30 AM', '02:00 PM', '05:45 PM', '09:15 PM'],
      },
      {
        movieId: 'MOV015', // Oppenheimer
        screenName: 'Audi 2 - IMAX with Laser',
        format: 'IMAX 2D',
        basePrice: 380,
        showTimes: ['11:00 AM', '03:15 PM', '07:30 PM'],
      },
      {
        movieId: 'MOV016', // Interstellar
        screenName: 'Audi 2 - IMAX with Laser',
        format: 'IMAX 2D',
        basePrice: 390,
        showTimes: ['01:00 PM', '05:30 PM', '09:45 PM'],
      },
      {
        movieId: 'MOV026', // Street Fighter (Release Oct 09)
        screenName: 'Audi 3 - IMAX 3D',
        format: 'IMAX 3D',
        basePrice: 400,
        showTimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
      },
    ],
  },
  {
    theatreId: '212',
    theatreName: 'INOX Forum Mall',
    city: 'Bengaluru',
    area: 'Koramangala',
    movieConfigs: [
      {
        movieId: 'MOV001', // Baththa
        screenName: 'Screen 1 - Dolby Atmos',
        format: 'Dolby Atmos',
        basePrice: 250,
        showTimes: ['10:15 AM', '01:45 PM', '05:30 PM', '09:00 PM'],
      },
      {
        movieId: 'MOV008', // Retro
        screenName: 'Screen 2',
        format: '2D',
        basePrice: 200,
        showTimes: ['11:15 AM', '02:45 PM', '06:30 PM', '10:00 PM'],
      },
      {
        movieId: 'MOV014', // Jawan
        screenName: 'Screen 3 - Insignia',
        format: 'Dolby Atmos',
        basePrice: 280,
        showTimes: ['12:00 PM', '03:45 PM', '07:30 PM'],
      },
    ],
  },
];

/**
 * Deterministic pseudo-random number generator for seat counts & live status
 */
function getDeterministicSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates dynamic, realistic shows for any given date string (YYYY-MM-DD)
 */
export function generateDynamicShowsForDate(dateStr: string): ShowRecord[] {
  const result: ShowRecord[] = [];
  const totalSeats = 85;

  THEATRE_CATALOG.forEach((theatre) => {
    theatre.movieConfigs.forEach((mConfig) => {
      const movie = findMovieByIdOrTitle(mConfig.movieId);
      if (!movie) return;

      // Strict validation: show date cannot precede premiere date
      if (!validateShowtime(movie.releaseDate, dateStr)) {
        return;
      }

      mConfig.showTimes.forEach((time, timeIdx) => {
        // Unique deterministic showId
        const showId = `${theatre.theatreId}_${mConfig.movieId}_${dateStr.replace(/-/g, '')}_${timeIdx + 1}`;

        // Deterministic seat availability based on date, theatre, movie, time
        const seed = getDeterministicSeed(`${showId}_${time}`);
        
        // Realistic distribution: prime shows (evening/weekend) have fewer seats left
        const isEvening = time.includes('06:') || time.includes('07:') || time.includes('08:') || time.includes('09:') || time.includes('10:');
        const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;

        let availableSeats: number;
        if (isWeekend && isEvening) {
          // Almost Full or Filling Fast
          availableSeats = 4 + (seed % 10); // 4 - 13 seats
        } else if (isEvening) {
          // Filling Fast
          availableSeats = 10 + (seed % 16); // 10 - 25 seats
        } else {
          // Available
          availableSeats = 32 + (seed % 42); // 32 - 73 seats
        }

        const status = calculateLiveStatus(availableSeats, totalSeats);

        // Price adjustments for prime formats/times
        let price = mConfig.basePrice;
        if (isWeekend) price += 20;

        result.push({
          showId,
          movieId: mConfig.movieId,
          movieTitle: movie.title,
          theatreId: theatre.theatreId,
          theatreName: theatre.theatreName,
          city: theatre.city,
          area: theatre.area,
          screenName: mConfig.screenName,
          showDate: dateStr,
          showTime: time,
          language: movie.language,
          format: mConfig.format,
          price,
          availableSeats,
          totalSeats,
          status,
        });
      });
    });
  });

  return result;
}

// 7-day pre-cached shows window starting from 2026-10-05 through 2026-10-15
const SHOWS_CACHE = new Map<string, ShowRecord>();

// Pre-fill the cache for current & upcoming days
const BASE_DATES = [
  '2026-10-05',
  '2026-10-06',
  '2026-10-07',
  '2026-10-08',
  '2026-10-09',
  '2026-10-10',
  '2026-10-11',
  '2026-10-12',
  '2026-10-13',
  '2026-10-14',
  '2026-10-15',
];

BASE_DATES.forEach((d) => {
  const dayShows = generateDynamicShowsForDate(d);
  dayShows.forEach((s) => {
    SHOWS_CACHE.set(s.showId, s);
  });
});

// Backward-compatible DEMO_SHOWS export (includes legacy IDs 501..532 mapped to dynamic generator)
export const DEMO_SHOWS: ShowRecord[] = Array.from(SHOWS_CACHE.values());

// Add legacy show ID aliases so existing routes like /seats/501 work seamlessly
const LEGACY_SHOW_ALIASES: Record<string, ShowRecord> = {
  '501': {
    showId: '501',
    movieId: 'MOV001',
    movieTitle: 'Baththa',
    theatreId: '217',
    theatreName: 'PVR INOX',
    city: 'Puducherry',
    area: 'White Town',
    screenName: 'Screen 1 - Dolby Atmos',
    showDate: '2026-10-05',
    showTime: '10:30 AM',
    language: 'Tamil',
    format: 'Dolby Atmos',
    price: 220,
    availableSeats: 58,
    totalSeats: 85,
    status: 'AVAILABLE',
  },
  '502': {
    showId: '502',
    movieId: 'MOV001',
    movieTitle: 'Baththa',
    theatreId: '217',
    theatreName: 'PVR INOX',
    city: 'Puducherry',
    area: 'White Town',
    screenName: 'Screen 1 - Dolby Atmos',
    showDate: '2026-10-05',
    showTime: '01:30 PM',
    language: 'Tamil',
    format: 'Dolby Atmos',
    price: 220,
    availableSeats: 16,
    totalSeats: 85,
    status: 'FILLING_FAST',
  },
  '503': {
    showId: '503',
    movieId: 'MOV001',
    movieTitle: 'Baththa',
    theatreId: '217',
    theatreName: 'PVR INOX',
    city: 'Puducherry',
    area: 'White Town',
    screenName: 'Screen 1 - Dolby Atmos',
    showDate: '2026-10-05',
    showTime: '07:30 PM',
    language: 'Tamil',
    format: 'Dolby Atmos',
    price: 240,
    availableSeats: 6,
    totalSeats: 85,
    status: 'ALMOST_FULL',
  },
};

/**
 * Returns shows matching a movie ID or Title on the selected date.
 * If no selected date is passed, defaults to today ('2026-10-05').
 */
export function getShowsByMovieId(movieIdOrTitle: string, selectedDate?: string): ShowRecord[] {
  const movie = findMovieByIdOrTitle(movieIdOrTitle);
  const targetId = movie?.movieId || movieIdOrTitle;
  const targetDate = selectedDate || '2026-10-05';

  // Check if date is pre-cached, otherwise generate dynamically
  let pool = Array.from(SHOWS_CACHE.values()).filter((s) => s.showDate === targetDate);
  if (pool.length === 0) {
    const freshShows = generateDynamicShowsForDate(targetDate);
    freshShows.forEach((s) => SHOWS_CACHE.set(s.showId, s));
    pool = freshShows;
  }

  return pool.filter((s) => {
    const matchesMovie = s.movieId === targetId || s.movieTitle.toLowerCase() === movieIdOrTitle.toLowerCase();
    if (!matchesMovie) return false;

    // Showtime validation against premiere date
    if (movie && !validateShowtime(movie.releaseDate, s.showDate)) {
      return false;
    }

    return true;
  });
}

/**
 * Returns shows matching a theatre ID on the selected date.
 */
export function getShowsByTheatreId(theatreId: string, selectedDate?: string): ShowRecord[] {
  const targetDate = selectedDate || '2026-10-05';

  let pool = Array.from(SHOWS_CACHE.values()).filter((s) => s.showDate === targetDate);
  if (pool.length === 0) {
    const freshShows = generateDynamicShowsForDate(targetDate);
    freshShows.forEach((s) => SHOWS_CACHE.set(s.showId, s));
    pool = freshShows;
  }

  return pool.filter((s) => {
    if (s.theatreId !== theatreId) return false;

    const movie = findMovieByIdOrTitle(s.movieId);
    if (movie && !validateShowtime(movie.releaseDate, s.showDate)) {
      return false;
    }

    return true;
  });
}

/**
 * Resolves any showId (whether legacy like '501' or dynamic like '217_MOV001_20261006_1')
 */
export function getShowById(showId: string): ShowRecord | undefined {
  if (LEGACY_SHOW_ALIASES[showId]) {
    return LEGACY_SHOW_ALIASES[showId];
  }

  if (SHOWS_CACHE.has(showId)) {
    return SHOWS_CACHE.get(showId);
  }

  // Parse dynamic ID components: {theatreId}_{movieId}_{dateCompact}_{timeIndex}
  const parts = showId.split('_');
  if (parts.length >= 4) {
    const dateCompact = parts[2];
    if (dateCompact.length === 8) {
      const yyyy = dateCompact.substring(0, 4);
      const mm = dateCompact.substring(4, 6);
      const dd = dateCompact.substring(6, 8);
      const isoDate = `${yyyy}-${mm}-${dd}`;
      const fresh = generateDynamicShowsForDate(isoDate);
      fresh.forEach((s) => SHOWS_CACHE.set(s.showId, s));
      return SHOWS_CACHE.get(showId);
    }
  }

  // Fallback to searching in all cached shows
  return Array.from(SHOWS_CACHE.values()).find((s) => s.showId === showId);
}
