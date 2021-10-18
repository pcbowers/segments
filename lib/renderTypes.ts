import type { SvelteComponentTyped } from 'svelte';
import type {
	NativeMods,
	NativeModDefs,
	NativeSegments,
	CustomModDef,
	CustomSegment,
	Segment
} from './segmentTypes';

/**
 * ### Type Expander
 *
 * Useful for intellisence within VSCode.
 */
type ExpandRecursively<Type> = Type extends (...args: infer Args) => infer Results
	? (...args: ExpandRecursively<Args>) => ExpandRecursively<Results>
	: Type extends Record<string, unknown>
	? Type extends infer ObjectType
		? { [Property in keyof ObjectType]: ExpandRecursively<ObjectType[Property]> }
		: never
	: Type;

/**
 * ### Normalized Modifiers
 *
 * This is important for serialization as all base modifiers will be converted to their
 * definitions or their base form (with an id and key).
 */
type NormalizedMods = { [Key in keyof NativeMods]: { _id: string; _type: Key } };

/**
 * ### All Native Modifiers
 *
 * A combination of string modifiers and predefined modifier definitions.
 */
type AllNativeMods = NormalizedMods & NativeModDefs;

/**
 * ### Native Modifier Types
 *
 * Allows for differentiation between known props and unknown props.
 */
type NativeModTypes = keyof AllNativeMods | string;

/**
 * ### Native Segment Types
 *
 * Allows for differentiation between known props and unknown props.
 */
type NativeSegmentTypes = keyof NativeSegments | string;

/**
 * ### Strict Serializer
 *
 * Allows you to define custom components for modifiers, segments,
 * and even a base unknown modifier and unknown segment.
 *
 * - `mods`: an object with custom modifier serializer components.
 * - `segments`: an object with custom segment serializer components.
 * - `unknownMod`: a property that takes a custom modifier component. Useful for rendering unknown modifiers.
 * - `unknownSegment`: a property that takes a custom segment component. Useful for rendering unknown segments.
 */
interface Serializers {
	mods?: { [Key in keyof AllNativeMods]?: new (...args: unknown[]) => ModifierComponent<Key> };
	segments?: { [Key in keyof NativeSegments]?: new (...args: unknown[]) => SegmentComponent<Key> };
	unknownMod?: new (...args: unknown[]) =>
		| ModifierComponent<keyof AllNativeMods>
		| ModifierComponent<string>;
	unknownSegment?: new (...args: unknown[]) =>
		| SegmentComponent<keyof NativeSegments>
		| SegmentComponent<string>;
}

/**
 * ### Custom Serializer
 *
 * Refer to the Serializers type. This differs by allowing custom mods
 * and segments that are not predefined.
 */
interface CustomSerializers extends Serializers {
	mods?: {
		[property: string]: new (...args: unknown[]) =>
			| ModifierComponent<keyof AllNativeMods>
			| ModifierComponent<string>;
	};
	segments?: {
		[property: string]: new (...args: unknown[]) =>
			| SegmentComponent<keyof NativeSegments>
			| SegmentComponent<string>;
	};
}

/**
 * ### Custom Renderer Options
 *
 * - `Serializers`: See the Serializers interface.
 * - `segments`: The actual segments that should be rendered.
 * - `errorOnUnknowns`: whether or not the renderer should ignore errors.
 * - `renderUnknownComponents`: whether or not the renderer should render unknowns defined by the serializer.
 * - `renderHardBreaks`: whether or not the `\n` character should be converted to a `<br />`.
 * - `renderPlainText`: ignore all types and simply print out all text segments as-is with no formatting.
 */
export interface CustomOptions {
	segments: (Segment | CustomSegment)[];
	serializers?: Serializers | CustomSerializers;
	errorOnUnknowns?: boolean;
	renderUnknownComponents?: boolean;
	renderHardBreaks?: boolean;
	renderPlainText?: boolean;
}

/**
 * ### Strict Renderer Options
 *
 * Refer to the CustomOptions type. This differs by only allowing known segments.
 */
export interface Options extends CustomOptions {
	segments: Segment[];
	serializers?: Serializers;
}

/**
 * ### Modifier Props
 *
 * Extract Modifier props from modifier: known or unknown.
 */
export type ModifierProps<Type extends NativeModTypes> = ExpandRecursively<
	Partial<Type extends keyof AllNativeMods ? AllNativeMods[Type] : CustomModDef>
>;

/**
 * ### Segment Props
 *
 * Extract Segment props from segment: known or unknown.
 */
export type SegmentProps<Type extends NativeSegmentTypes> = ExpandRecursively<
	Partial<Type extends keyof NativeSegments ? NativeSegments[Type] : CustomSegment>
>;

/**
 * ### Modifier Component
 *
 * Create a typed component for svelte that utilizes the modifier props.
 */
export type ModifierComponent<Type extends NativeModTypes> = SvelteComponentTyped<{
	mod: ModifierProps<Type>;
	options: CustomOptions;
}>;

/**
 * ### Segment Component
 *
 * Create a typed component for svelte that utilizes the segment props.
 */
export type SegmentComponent<Type extends NativeSegmentTypes> = SvelteComponentTyped<{
	segment?: SegmentProps<Type>;
	options?: CustomOptions;
}>;
