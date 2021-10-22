import type { SvelteComponentTyped } from 'svelte';
import type { ModDef, BaseSegment, Segment, StrictSegment, BaseModDef } from './segmentTypes';

/**
 * ### Base Render Options
 *
 * - `segments`: The actual segments that should be rendered.
 * - `serializers`: accepts `mods`, `segments`, `unknownMod`, and `unknownSegment`. The `mods` and `segments` properties accept an object where the key represents the type and the value is the component that serializes the type. Modifier/Segment data and the options are provided to each component.
 * - `errorOnUnknowns`: whether or not the renderer should ignore errors.
 * - `renderUnknownComponents`: whether or not the renderer should render unknowns defined by the serializer.
 * - `renderHardBreaks`: whether or not the `\n` character should be converted to a `<br />`.
 * - `renderPlainText`: ignore all types and simply print out all text segments as-is with no formatting.
 */
interface BaseRenderOptions<
	ModComponentType,
	SegmentComponentType,
	ModDefType extends BaseModDef = ModDef,
	SegmentType extends BaseSegment<ModDefType> = BaseSegment<ModDefType>
> {
	segments: SegmentType[];
	serializer?: {
		mods?: Record<string, ModComponentType>;
		segments?: Record<string, SegmentComponentType>;
		unknownMod?: ModComponentType;
		unknownSegment?: SegmentComponentType;
	};
	errorOnUnknowns?: boolean;
	renderUnknownComponents?: boolean;
	renderHardBreaks?: boolean;
	renderPlainText?: boolean;
}

/**
 * ### Modifier Components
 *
 * Contains a list of all modifier components for each renderer.
 */
interface ModComponents<ModDefType extends BaseModDef = ModDef> {
	svelte: new (...args: unknown[]) => SvelteComponentTyped<{
		mod: Partial<ModDefType>;
		options?: RenderOptions<'svelte', true>;
	}>;
}

/**
 * ### Segment Components
 *
 * Contains a list of all segment components for each renderer.
 */
interface SegmentComponents<
	ModDefType extends BaseModDef = ModDef,
	SegmentType extends BaseSegment<ModDefType> = BaseSegment<ModDefType>
> {
	svelte: new (...args: unknown[]) => SvelteComponentTyped<{
		segment: Partial<SegmentType>;
		options?: RenderOptions<'svelte', true>;
	}>;
}

/**
 * ### Options
 *
 * Create a set of render options. Accepts between 1 and 5 generics.
 * - `RenderType`: The type of renderer.
 * - `Strict`: Whether or not _id should be required.
 * - `ModType`: Allows for a custom list of string literals to allow modifier autocompletion.
 * - `ModDefType`: Allows for custom typing for modifier definitions for better typescript Intellisense.
 * - `SegmentType`: Allows for custom typing for segments for better typescript Intellisense.
 *
 * The following options are available to you:
 * - `segments`: The actual segments that should be rendered.
 * - `serializers`: accepts `mods`, `segments`, `unknownMod`, and `unknownSegment`. The `mods` and `segments` properties accept an object where the key represents the type and the value is the component that serializes the type. Modifier/Segment data and the options are provided to each component.
 * - `errorOnUnknowns`: whether or not the renderer should ignore errors.
 * - `renderUnknownComponents`: whether or not the renderer should render unknowns defined by the serializer.
 * - `renderHardBreaks`: whether or not the `\n` character should be converted to a `<br />`.
 * - `renderPlainText`: ignore all types and simply print out all text segments as-is with no formatting.
 */

// export type RenderOptions
export type RenderOptions<
	RenderType extends keyof ModComponents,
	Strict extends boolean = false,
	ModType extends string = string,
	ModDefType extends BaseModDef = ModDef,
	SegmentType extends BaseSegment<ModDefType> = BaseSegment<ModDefType> & {
		[property: string]: unknown;
	}
> = Strict extends false
	? BaseRenderOptions<
			ModComponents<ModDefType>[RenderType],
			SegmentComponents<ModDefType, Segment<ModType, ModDefType, SegmentType>>[RenderType],
			ModDefType,
			Segment<ModType, ModDefType, SegmentType>
	  >
	: BaseRenderOptions<
			ModComponents<ModDefType>[RenderType],
			SegmentComponents<ModDefType, StrictSegment<ModType, ModDefType, SegmentType>>[RenderType],
			ModDefType,
			StrictSegment<ModType, ModDefType, SegmentType>
	  >;
