<script lang="ts">
	import type { RenderOptions } from '$lib/renderTypes';
	import Renderer from './Renderer.svelte';

	let rendererOptions: RenderOptions<'svelte'> = {
		segments: [
			{
				_id: 'asdf',
				_type: 'brsoski',
				bro: 'asdf',
				num: 1243,
				mods: ['324kj', 'becca'],
				children: [
					{
						_type: 'broski',
						_id: 'asdf',
						num: 123,
						bro: 'asdf',
						mods: ['asdf', 'asdf', 'qwer', 'becca'],
						modDefs: [
							{
								_id: 'qwer',
								_type: 'broski',
								bro: 'asdf',
								num: 123
							}
						],
						children: [
							{
								_type: 'broski',
								_id: 'asdf',
								bro: 'asdf',
								num: 123,
								mods: ['asdf', 'qwer', '1234']
							}
						]
					}
				]
			}
		]
	};
</script>

<Renderer options={rendererOptions} />
