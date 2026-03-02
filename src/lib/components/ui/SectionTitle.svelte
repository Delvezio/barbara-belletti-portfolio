<script lang="ts">
  export let overtitle: string;
  export let title: string;
  export let titleSize: string = 'text-fluid-6xl';
  export let customclass: string = '';

  // default graphite, opzionale white
  export let tone: 'graphite' | 'white' = 'graphite';


  const titleTone = tone === 'white' ? 'text-white' : 'text-graphite';
  const titleLeading = 'leading-tight';
  export let align: 'left' | 'center' = 'left';

  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const overAlignClass = align === 'center' ? 'justify-center' : 'justify-start';

</script>

<div class={alignClass + ' ' + customclass}>
  <div class={`flex ${overAlignClass}`}>
    <h4 class="text-sm tracking-widest font-bold text-neon-pink-500 uppercase">
      {overtitle}
    </h4>
  </div>

  <h2 class={`mt-4 ${titleSize} font-black tracking-tight ${titleTone} ${titleLeading}`}>
    {title}
  </h2>
</div>
