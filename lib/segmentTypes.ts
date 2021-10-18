/**
 * ### Literal Union
 *
 * Allow literal unions for type completion with Intellisense in VSCode.
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * ### Base Modifier Definition
 *
 * Every base modifier definition has a `_type` and an `_id`.
 */
export interface BaseModDef {
	_type: string;
	_id: string;
}

/**
 * ### Custom Modifier Definition
 *
 * This type allows the Base Modifier Definition to be extensible.
 */
export interface CustomModDef extends BaseModDef {
	[property: string]: unknown;
}

/**
 * ### General Segment
 *
 * A general segment.
 *
 * - `_id`: the id of the segment.
 * - `_type`: the type of the segment.
 * - `children`: An array of segments that are children of this segment.
 * - `content`: An array of segments that make of the content of this one. Typically the special Text Segment.
 * - `mods`: An array of strings referring to string modifiers or an _id of a modDef.
 * - `modDefs`: An array of modifier definitions.
 */
interface GeneralSegment {
	_id: string;
	_type: string;
	children?: GeneralSegment[];
	content?: GeneralSegment[];
	mods?: LiteralUnion<Mod>[];
	modDefs?: (ModDef | CustomModDef)[];
}

/**
 * ### Base Segment
 *
 * Extension of GeneralSegment though does not allow Custom modifier definitions.
 */
export interface BaseSegment extends GeneralSegment {
	children?: Segment[];
	content?: Segment[];
	modDefs?: ModDef[];
}

/**
 * ### Custom Segment
 *
 * Extension of GeneralSegment but allows any other custom properties as well.
 */
export interface CustomSegment extends GeneralSegment {
	children?: CustomSegment[];
	content?: CustomSegment[];
	[property: string]: unknown;
}

/**
 * ### Indent Modifier Definition
 *
 * Predefined Indent Modifier Definition.
 */
export interface Indent extends BaseModDef {
	_type: 'indent';
	indents: number;
	hangingIndent: boolean;
}

/**
 * ### Alignment Modifier Definition
 *
 * Predefined Alignment Modifier Definition.
 */
export interface Alignment extends BaseModDef {
	_type: 'alignment';
	alignment: 'left' | 'right' | 'center' | 'justify';
}

/**
 * ### Font Modifier Definition
 *
 * Predefined Font Modifier Definition.
 */
export interface Font extends BaseModDef {
	_type: 'font';
	fontFace?: string;
	fontSize?: string;
}

/**
 * ### Color Modifier Definition
 *
 * Predefined Color Modifier Definition.
 */
export interface Color<Type extends string> extends BaseModDef {
	_type: Type;
	rgb: {
		r: number;
		g: number;
		b: number;
	};
	hsl: {
		h: number;
		s: number;
		l: number;
	};
	hsv: {
		h: number;
		s: number;
		v: number;
	};
	alpha: number;
	hex: string;
}

/**
 * ### Indent Link Definition
 *
 * Predefined Link Modifier Definition.
 */
export interface Link extends BaseModDef {
	_type: 'link';
	href: string;
	target?: string;
}

/**
 * ### Native Modifier Definitions
 *
 * An object containing all the current native modifier definitions.
 */
export interface NativeModDefs {
	indent: Indent;
	alignment: Alignment;
	font: Font;
	color: Color<'color'>;
	highlight: Color<'highlight'>;
	link: Link;
}

/**
 * ### Modifier Definition
 *
 * A modifier definition selector that uses the predefined keys to add automatic typing.
 */
export type ModDef = { [Key in keyof NativeModDefs]: NativeModDefs[Key] }[keyof NativeModDefs];

/**
 * ### Native Modifiers
 *
 * An object containing all the current native modifiers.
 */
export interface NativeMods {
	bold: 'bold';
	italic: 'italic';
	underline: 'underline';
	strikethrough: 'strikethrough';
	code: 'code';
	superscript: 'superscript';
	subscript: 'subscript';
	lowercase: 'lowercase';
	uppercase: 'uppercase';
	sentencecase: 'sentencecase';
	capitalize: 'capitalize';
}

/**
 * ### Modifier
 *
 * A modifier selector that uses the predefined keys to add automatic typing.
 */
export type Mod = { [Key in keyof NativeMods]: NativeMods[Key] }[keyof NativeMods];

/**
 * ### Simple Segment
 *
 * A simple segment defintion that extends the base segment.
 * The only difference is the type is now a specific string literal.
 */
export interface SimpleSegment<Type extends string> extends BaseSegment {
	_type: Type;
}

/**
 * ### List Segment
 *
 * A list segment.
 */
export interface List<Type extends string> extends BaseSegment {
	_type: Type;
	start?: number;
}

/**
 * ### Text Segment
 *
 * The foundational segment that allows for text to be inserted.
 */
export interface Text extends BaseSegment {
	_type: 'text';
	text: string;
}

/**
 * ### Native Segments
 *
 * An object containing all the current native segments.
 */
export interface NativeSegments {
	text: Text;
	listbullet: List<'listbullet'>;
	listnumber: List<'listnumber'>;
	listupperletter: List<'listupperletter'>;
	listlowerletter: List<'listlowerletter'>;
	listupperroman: List<'listupperroman'>;
	listlowerroman: List<'listlowerroman'>;
	paragraph: SimpleSegment<'paragraph'>;
	quote: SimpleSegment<'quote'>;
	horizontalrule: SimpleSegment<'horizontalrule'>;
	heading1: SimpleSegment<'heading1'>;
	heading2: SimpleSegment<'heading2'>;
	heading3: SimpleSegment<'heading3'>;
	heading4: SimpleSegment<'heading4'>;
	heading5: SimpleSegment<'heading5'>;
	heading6: SimpleSegment<'heading6'>;
}

/**
 * ### Segment
 *
 * A segment selector that uses the predefined keys to add automatic typing.
 */
export type Segment = { [Key in keyof NativeSegments]: NativeSegments[Key] }[keyof NativeSegments];
