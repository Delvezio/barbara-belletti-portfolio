<script lang="ts">
  import { resolve } from '$app/paths';
  import Container from '$lib/components/ui/Container.svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<header class="mt-4 md:mt-8 z-50 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
  <Container className="h-16 flex items-center justify-between">
    <!-- Logo minimal -->
    <a href={resolve('/')} class="inline-flex items-center">
        <img
            src="/images/bbelletti-icon-logo.svg"
            alt="Barbara Belletti"
            class="h-10 w-auto lg:max-h-20"
            decoding="async"
        />
    </a>

    <!-- Nav desktop -->
    <nav class="hidden lg:flex items-center gap-8 text-sm font-semibold text-graphite/80">
      <a class="hover:text-neon-pink-500 duration-300 ease-in" href="#about">Chi sono</a>
      <a class="hover:text-neon-pink-500 duration-300 ease-in" href="#services">I miei servizi</a>
      <a class="hover:text-neon-pink-500 duration-300 ease-in" href="#method">Metodo</a>
      <a class="hover:text-neon-pink-500 duration-300 ease-in" href="#portfolio">Portfolio</a>
      <a class="hover:text-neon-pink-500 duration-300 ease-in" href="#testimonials">Recensioni</a>
    </nav>

    <!-- CTA -->
    <Button href="mailto:info@bbelletti.it" size="md" className="gap-2">
  <!-- icona sempre visibile -->
  

  <!-- testo solo da lg in su -->
  <span class="hidden lg:inline">Scrivimi ora</span>

  <!-- label accessibile per screen reader su mobile -->
  <span class="sr-only">Scrivimi ora</span>

  <svg
  class="h-6 w-6 lg:hidden"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</Button>

  </Container>
</header>
