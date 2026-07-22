const HeroSection = () => {
  return (
    <section className="relative h-[700px] w-full overflow-hidden">
      {/* Full-page background image */}
      <img
        src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/07/20201751/hero-home-desk.webp"
        alt="Hero Banner"
        className="absolute inset-0 h-[700px] w-full object-cover"
      />
    </section>
  )
}

export default HeroSection
