<script lang="ts">
	import type { Options } from '$lib/renderTypes';
	import Renderer from './Renderer.svelte';

	let rendererOptions: Options = {
		segments: [
			{
				_id: 'asdf',
				_type: 'horizontalrule'
			}
		]
	};
</script>

<Renderer options={rendererOptions} />
