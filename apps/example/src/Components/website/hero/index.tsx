import { Button } from '@swift/components/Button';
import { Text } from '@swift/components/Text';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import FlipWords from './flip-words';
import { ArrowRight } from '@swift/icons';

const HeroSection = () => {
  const [ref] = useScrollProgress<HTMLDivElement>();

  return (
    <section ref={ref} className="relative h-175 w-full overflow-hidden">
      {/* Full-page background image */}
      <img
        src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/07/20201751/hero-home-desk.webp"
        alt="Hero Banner"
        className="absolute inset-0 h-175 w-full object-cover"
      />

      {/* Left-side gradient for text legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />

      {/* Left-aligned hero content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-4 pt-25 sm:px-6 lg:px-8">
        <div className="flex max-w-xl flex-col gap-5 absolute top-1/2 transform -translate-y-1/2">
          <Text
            variant="heading-xl"
            fontWeight="bold"
            variantMapping={{ 'heading-xl': 'h1' }}
            className='text-white'
          >
            The{' '}
            <FlipWords
              words={['Future', 'Present', 'Power', 'Choice']}
              background="transparent"
            />{' '}
            is Solar. Bring it Home Today.
          </Text>
          <Text variant="para-lg">
            With India&rsquo;s No.&nbsp;1 Home Solar Brand.
          </Text>
          <div>
            <Button
              variant="primary"
              size="lg"
              className="!rounded-full"
            >
              Get Free Quote <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
