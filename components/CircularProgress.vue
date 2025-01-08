<template>
  <div :class="`spinner`" :style="spinnerStyle"></div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#474bff',  // Default color
  },
  size: {
    type: String,
    default: 'base',  // Default size is 'base'
  },
});

const size = {
  sm: 25,
  md: 30,
  base: 40,
  lg: 50,
  xl: 60,
};

const strokeWidth = {
  sm: 4,
  md: 4,
  base: 5,
  lg: 6,
  xl: 7,
};

const spinnerStyle = computed(() => {
  const spinnerSize = size[props.size] || size.base; // Default to 'base' if size is not recognized
  const stroke = strokeWidth[props.size] || strokeWidth.base; // Default to 'base' stroke width

  return {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    background: `radial-gradient(farthest-side, ${props.color} 94%, #0000) top/${stroke}px ${stroke}px no-repeat,
                conic-gradient(#0000 30%, ${props.color})`,
    '-webkit-mask': `radial-gradient(farthest-side, #0000 calc(100% - ${stroke}px), #000 0)`,
  };
});
</script>

<style scoped>
.spinner {
   border-radius: 50%;
   background: radial-gradient(farthest-side, #474bff 94%, #0000) top/9px 9px no-repeat,
          conic-gradient(#0000 30%, #474bff);
   -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
   animation: spinner-c7wet2 1s infinite linear;
}

@keyframes spinner-c7wet2 {
   100% {
      transform: rotate(1turn);
   }
}
</style>
