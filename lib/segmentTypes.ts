/**
 * ### Literal Union
 *
 * Allow literal unions for type completion with Intellisense in VSCode.
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * ### Modifier Definition
 *
 * Every modifier definition has a `_id` and an `_type`.
 */
export interface BaseModDef {
	_id: string;
	_type: string;
}

/**
 * ### Modifier Definition
 *
 * This type allows the Modifier Definition to be extensible.
 */
export interface ModDef extends BaseModDef {
	[property: string]: unknown;
}

/**
 * ### Base Segment
 *
 * The base segment type. Accepts a generic to define the type for modifier definitions.
 *
 * - `_id`: the id of the segment.
 * - `_type`: the type of the segment.
 * - `children`: An array of segments that are children of this segment.
 * - `content`: An array of segments that make of the content of this one. Typically the special Text Segment.
 * - `mods`: An array of strings referring to string modifiers or an _id of a modDef.
 * - `modDefs`: An array of modifier definitions.
 */
export interface BaseSegment<ModDefType extends BaseModDef = ModDef> {
	_id?: string;
	_type: string;
	children?: BaseSegment<ModDefType>[];
	content?: BaseSegment<ModDefType>[];
	mods?: string[];
	modDefs?: ModDefType[];
}

/**
 * ### Segment
 *
 * This type allows the base segment to be extensible.
 */
export type Segment<
	ModType extends string = string,
	ModDefType extends BaseModDef = ModDef,
	SegmentType extends BaseSegment<ModDefType> = BaseSegment<ModDefType>
> = Omit<SegmentType, 'children' | 'content' | 'modDefs' | 'mods'> & {
	children?: Segment<ModType, ModDefType, SegmentType>[];
	content?: Segment<ModType, ModDefType, SegmentType>[];
	mods?: ModType[];
	modDefs?: ModDefType[];
};

/**
 * ### Strict Segment
 *
 * The base strict segment type. Requires an `_id` for all segments.
 *
 */
export type StrictSegment<
	ModType extends string = string,
	ModDefType extends BaseModDef = ModDef,
	SegmentType extends BaseSegment<ModDefType> = BaseSegment<ModDefType>
> = Omit<SegmentType, 'children' | 'content' | 'modDefs' | 'mods'> & {
	children?: StrictSegment<ModType, ModDefType, SegmentType>[];
	content?: StrictSegment<ModType, ModDefType, SegmentType>[];
	mods?: LiteralUnion<ModType>[];
	modDefs?: ModDefType[];
	_id: string;
};
