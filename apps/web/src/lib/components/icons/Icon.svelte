<script lang="ts">
  import IconifyIcon from '@iconify/svelte';

  interface Props {
    icon: string;
    size?: number | string;
    class?: string;
    inline?: boolean;
    color?: string;
    [key: string]: any;
  }

  let {
    icon,
    size = '1em',
    class: className = '',
    inline = false,
    color,
    ...rest
  }: Props = $props();

  const formattedSize = $derived(typeof size === 'number' ? `${size}px` : size);
</script>

<span
  class="inline-flex items-center justify-center shrink-0 align-middle {className}"
  style:width={formattedSize}
  style:height={formattedSize}
  style:color={color}
  aria-hidden="true"
  {...rest}
>
  <IconifyIcon
    {icon}
    width={formattedSize}
    height={formattedSize}
    {inline}
  />
</span>
