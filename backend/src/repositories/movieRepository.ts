import { executeQuery, executeProcedure } from '../config/database.js';
import { Movie } from '../types/index.js';

const DEMO_MOVIES: Movie[] = [
  {
    id: 'MOV001',
    title: 'Baththa',
    description: 'Baththa is a gripping Tamil action drama exploring gritty street justice, raw loyalty, and redemption in the bustling coastal heartlands.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 142,
    releaseDate: '2026-10-01',
    format: '2D',
    language: 'Tamil',
    genre: 'Action, Drama',
    rating: 7.8,
    status: 'RUNNING',
  },
  {
    id: 'MOV002',
    title: 'Yezhu Kadal Yezhu Malai',
    description: 'A poetic and metaphysical Tamil drama mystery recounting an undying romantic journey spanning centuries through oceans and mystic mountain peaks.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 150,
    releaseDate: '2026-10-01',
    format: '2D',
    language: 'Tamil',
    genre: 'Drama, Mystery',
    rating: 8.0,
    status: 'RUNNING',
  },
  {
    id: 'MOV003',
    title: 'Anbil Avan',
    description: 'A poignant and stirring romantic action drama portraying the lengths to which an ordinary man will go to protect the devotion of his beloved.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 145,
    releaseDate: '2026-10-02',
    format: '2D',
    language: 'Tamil',
    genre: 'Action, Drama, Romance',
    rating: 7.6,
    status: 'RUNNING',
  },
  {
    id: 'MOV004',
    title: 'Sigma',
    description: 'An adrenaline-surging cyber-heist and rogue agent thriller where a lone wolf strategist deconstructs an international biometric syndicate.',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 138,
    releaseDate: '2026-10-02',
    format: '2D',
    language: 'Tamil',
    genre: 'Action, Thriller',
    rating: 7.7,
    status: 'RUNNING',
  },
  {
    id: 'MOV005',
    title: 'Kitti',
    description: 'An authentic sports drama unfolding in rural Tamil Nadu celebrating the raw passions and community rivalries of indigenous gilli-danda tournaments.',
    posterUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 134,
    releaseDate: '2026-10-02',
    format: '2D',
    language: 'Tamil',
    genre: 'Drama, Sport',
    rating: 7.5,
    status: 'RUNNING',
  },
  {
    id: 'MOV006',
    title: 'Bison Kaalamaadan',
    description: 'A ferocious period sports biopic set in the southern plains tracking the tempestuous rise of a lightning sprinter battling oppressive village hierarchy.',
    posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 156,
    releaseDate: '2026-10-08',
    format: '2D',
    language: 'Tamil',
    genre: 'Action, Drama, Sport',
    rating: 8.1,
    status: 'UPCOMING',
  },
  {
    id: 'MOV007',
    title: 'Good Bad Ugly',
    description: 'A high-octane mass masala gangster action extravaganza chronicling the clash of three ruthless power brokers over golden trade corridors.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 160,
    releaseDate: '2026-10-09',
    format: '2D',
    language: 'Tamil',
    genre: 'Action, Comedy, Crime',
    rating: 8.3,
    status: 'UPCOMING',
  },
  {
    id: 'MOV008',
    title: 'Demonte Colony 3',
    description: 'The terrifying third installment unearthing forgotten Portuguese cursed catacombs beneath modern Chennai as paranormal researchers get entombed.',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 132,
    releaseDate: '2026-10-15',
    format: '2D',
    language: 'Tamil',
    genre: 'Horror, Mystery, Thriller',
    rating: 7.9,
    status: 'UPCOMING',
  },
  {
    id: 'MOV009',
    title: 'Kanchana 4',
    description: 'A hilarious yet spine-chilling horror comedy where a ghost-fearing man becomes the vessel for vengeance-seeking spirits in a haunted mansion.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 148,
    releaseDate: '2026-10-22',
    format: '2D',
    language: 'Tamil',
    genre: 'Comedy, Horror',
    rating: 7.7,
    status: 'UPCOMING',
  },
  {
    id: 'MOV010',
    title: 'Jailer 2',
    description: 'Tiger Muthuvel Pandian returns in this thunderous blockbuster sequel facing an even deadlier pan-Indian weapon syndicate menacing his extended family.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 168,
    releaseDate: '2026-10-23',
    format: 'Dolby Atmos',
    language: 'Tamil',
    genre: 'Action, Comedy, Drama',
    rating: 8.5,
    status: 'UPCOMING',
  },
  {
    id: 'MOV013',
    title: 'The Third Murder',
    description: 'An intricate investigative Malayalam courtroom drama unraveling the psychological knots of a seemingly open-and-shut homicide confession.',
    posterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 139,
    releaseDate: '2026-10-01',
    format: '2D',
    language: 'Malayalam',
    genre: 'Crime, Drama, Mystery',
    rating: 7.9,
    status: 'RUNNING',
  },
  {
    id: 'MOV014',
    title: "Don't Trouble The Trouble",
    description: 'A rip-roaring fantasy comedy tracking two unwitting small-time hustlers who stumble into an enchanted talisman that makes their wildest white lies come true.',
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 128,
    releaseDate: '2026-10-01',
    format: '2D',
    language: 'Malayalam',
    genre: 'Comedy, Fantasy',
    rating: 7.7,
    status: 'RUNNING',
  },
  {
    id: 'MOV017',
    title: 'Torpedo',
    description: 'A breathless high-seas submarine action thriller involving a veteran naval captain neutralizing an underwater insurgent threat off the Malabar coast.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 144,
    releaseDate: '2026-10-08',
    format: '2D',
    language: 'Malayalam',
    genre: 'Action, Thriller',
    rating: 8.2,
    status: 'UPCOMING',
  },
  {
    id: 'MOV019',
    title: 'Lucifer 2: Empuraan',
    description: 'The monumental second chapter uncovering Stephen Nedumpally alias Khuresh Ab’raam’s globe-spanning empire and ruthless international kingmakers.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 172,
    releaseDate: '2026-10-15',
    format: 'Dolby Atmos',
    language: 'Malayalam',
    genre: 'Action, Crime, Drama',
    rating: 8.6,
    status: 'UPCOMING',
  },
  {
    id: 'MOV025',
    title: 'Digger',
    description: 'A heart-stopping excavation survival thriller where an underground rescue team uncovers an impossible subterranean conspiracy beneath Arctic ice.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 110,
    releaseDate: '2026-10-02',
    format: '2D',
    language: 'English',
    genre: 'Action, Thriller',
    rating: 7.8,
    status: 'RUNNING',
  },
  {
    id: 'MOV026',
    title: 'Street Fighter',
    description: 'Legendary world warriors clash in an exhilarating tournament saga packed with visceral martial arts spectacles and mystical ki mastery.',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 130,
    releaseDate: '2026-10-09',
    format: 'IMAX',
    language: 'English',
    genre: 'Action, Adventure, Sci-Fi',
    rating: 8.1,
    status: 'UPCOMING',
  },
  {
    id: 'MOV027',
    title: 'TRON: Ares',
    description: 'A revolutionary digital entity crosses over from the luminous Grid into the real world initiating the next phase of human-technological coexistence.',
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 135,
    releaseDate: '2026-10-09',
    format: 'IMAX 3D',
    language: 'English',
    genre: 'Action, Adventure, Sci-Fi',
    rating: 8.3,
    status: 'UPCOMING',
  },
  {
    id: 'MOV036',
    title: 'Tony',
    description: 'An intimate biographical drama capturing the passionate artistry and dramatic life of culinary and culture revolutionary Anthony Bourdain.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    trailerUrl: '',
    durationMinutes: 120,
    releaseDate: '2026-10-02',
    format: '2D',
    language: 'English',
    genre: 'Biography, Drama',
    rating: 7.5,
    status: 'RUNNING',
  },
];

export class MovieRepository {
  async getAllMovies(): Promise<Movie[]> {
    try {
      const sql = `
        SELECT MOVIE_ID AS "id", TITLE AS "title", DESCRIPTION AS "description", 
               LANGUAGE AS "language", GENRE AS "genre", DURATION_MINUTES AS "durationMinutes",
               RELEASE_DATE AS "releaseDate", CERTIFICATE AS "certificate", RATING AS "rating",
               STATUS AS "status", POSTER_URL AS "posterUrl", BACKDROP_URL AS "backdropUrl", FORMAT AS "format"
        FROM MOVIES 
        WHERE STATUS != 'CANCELLED' 
        ORDER BY RELEASE_DATE DESC
      `;
      const result = await executeQuery(sql);
      if (result.rows && result.rows.length > 0) {
        return result.rows.map((r: any) => ({
          ...r,
          id: String(r.id),
          language: r.language || 'Tamil',
          genre: r.genre || 'Action',
          format: r.format || '2D',
          status: r.status || 'RUNNING',
        }));
      }
      return DEMO_MOVIES;
    } catch {
      return DEMO_MOVIES;
    }
  }

  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const sql = `
        SELECT MOVIE_ID AS "id", TITLE AS "title", DESCRIPTION AS "description", 
               LANGUAGE AS "language", GENRE AS "genre", DURATION_MINUTES AS "durationMinutes",
               RELEASE_DATE AS "releaseDate", CERTIFICATE AS "certificate", RATING AS "rating",
               STATUS AS "status", POSTER_URL AS "posterUrl", BACKDROP_URL AS "backdropUrl", FORMAT AS "format"
        FROM MOVIES 
        WHERE MOVIE_ID = :id
      `;
      const result = await executeQuery(sql, { id: Number(id) || id });
      if (result.rows && result.rows.length > 0) {
        const r: any = result.rows[0];
        return {
          ...r,
          id: String(r.id),
          language: r.language || 'Tamil',
          genre: r.genre || 'Action',
          format: r.format || '2D',
          status: r.status || 'RUNNING',
        };
      }
      const matched = DEMO_MOVIES.find((m) => m.id === id || m.title.toLowerCase() === id.toLowerCase());
      return matched || DEMO_MOVIES[0];
    } catch {
      const matched = DEMO_MOVIES.find((m) => m.id === id || m.title.toLowerCase() === id.toLowerCase());
      return matched || DEMO_MOVIES[0];
    }
  }

  async getMoviesByLocation(locationId: string): Promise<Movie[]> {
    try {
      const sql = `
        SELECT DISTINCT m.MOVIE_ID AS "id", m.TITLE AS "title", m.DESCRIPTION AS "description",
               m.LANGUAGE AS "language", m.GENRE AS "genre", m.DURATION_MINUTES AS "durationMinutes",
               m.RELEASE_DATE AS "releaseDate", m.CERTIFICATE AS "certificate", m.RATING AS "rating",
               m.STATUS AS "status", m.POSTER_URL AS "posterUrl", m.BACKDROP_URL AS "backdropUrl", m.FORMAT AS "format"
        FROM MOVIES m
        JOIN SHOWS s ON m.MOVIE_ID = s.MOVIE_ID
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        JOIN THEATRES t ON sc.THEATRE_ID = t.THEATRE_ID
        WHERE t.LOCATION_ID = :locationId AND m.STATUS = 'RUNNING' AND s.IS_ACTIVE = 1
      `;
      const result = await executeQuery(sql, { locationId: Number(locationId) });
      if (result.rows && result.rows.length > 0) {
        return result.rows.map((r: any) => ({
          ...r,
          id: String(r.id),
        }));
      }
      return DEMO_MOVIES.filter((m) => m.status === 'RUNNING');
    } catch {
      return DEMO_MOVIES.filter((m) => m.status === 'RUNNING');
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const q = query.toLowerCase();
    const all = await this.getAllMovies();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.language.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }

  async addMovie(movie: Omit<Movie, 'id'>): Promise<string> {
    const nextId = DEMO_MOVIES.length + 1;
    const movieId = `MOV0${nextId}`;
    try {
      const sql = `
        INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, FORMAT)
        VALUES (:id, :title, :description, :language, :genre, :duration, TO_DATE(:releaseDate, 'YYYY-MM-DD'), :certificate, :rating, :status, :posterUrl, :format)
      `;
      await executeQuery(sql, {
        id: nextId,
        title: movie.title,
        description: movie.description,
        language: movie.language,
        genre: movie.genre,
        duration: movie.durationMinutes,
        releaseDate: typeof movie.releaseDate === 'string' ? movie.releaseDate : '2026-10-05',
        certificate: 'UA',
        rating: movie.rating || 7.5,
        status: movie.status || 'RUNNING',
        posterUrl: movie.posterUrl || '',
        format: movie.format || '2D',
      });
      return String(nextId);
    } catch {
      return movieId;
    }
  }
}

export const movieRepository = new MovieRepository();
