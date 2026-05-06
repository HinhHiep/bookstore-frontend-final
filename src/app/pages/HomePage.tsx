import { HeroCarousel } from '../components/HeroCarousel';
import { Features } from '../components/Features';
import { BestSellers } from '../components/BestSellers';
import { BookFinder } from '../components/BookFinder';
import { NewBooks } from '../components/NewBooks';
import { AIRecommendation } from '../components/AIRecommendation';
import { Categories } from '../components/Categories';

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Features />
      <BestSellers />
      <BookFinder />
      <NewBooks />
      <AIRecommendation />
      <Categories />
    </>
  );
}
