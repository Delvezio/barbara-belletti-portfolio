<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const ids = ['about', 'services', 'method', 'contact', 'portfolio', 'testimonials'];

		const els = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));

		if (!els.length) return;

		const setHash = (id: string | '') => {
			const url = id ? `#${id}` : location.pathname;
			history.replaceState(null, '', url);
		};

		// Sentinel top: quando sei in alto, togli hash
		const topSentinel = document.createElement('div');
		topSentinel.style.position = 'absolute';
		topSentinel.style.top = '0';
		topSentinel.style.left = '0';
		topSentinel.style.width = '1px';
		topSentinel.style.height = '1px';
		document.body.prepend(topSentinel);

		const ioTop = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setHash('');
			},
			{ threshold: 1 }
		);
		ioTop.observe(topSentinel);

		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

				const id = (visible?.target as HTMLElement | undefined)?.id;
				if (!id) return;

				if (location.hash !== `#${id}`) setHash(id);
			},
			{ threshold: [0.35, 0.5, 0.65] }
		);

		els.forEach((el) => io.observe(el));

		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
			if (!link) return;

			const href = link.getAttribute('href');
			if (!href || href === '#') return;

			const id = href.slice(1);
			const el = document.getElementById(id);
			if (!el) return;

			e.preventDefault();

			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
			// niente pushState: ci pensa l'IntersectionObserver con replaceState
		};

		document.addEventListener('click', onClick, true);

		return () => {
			document.removeEventListener('click', onClick, true);
			io.disconnect();
			ioTop.disconnect();
			topSentinel.remove();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}