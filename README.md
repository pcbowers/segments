# Segments - Abstracting and Rendering Rich Content with JSON

`npm i @pcbowers/segments`

Segments is yet another JSON based rich text specification. How it differs from other specifications is in its simplicity and extensibility. In fact, the specification itself requires very little and decisions are intentionally left to the discretion of its users.

## Anatomy

A base segment has the following shape:

```typescript
interface Segment {
  _id: string;
  _type: string;
  children?: Segment[];
  content?: Segment[];
  mods?: string[];
  modDefs?: {
    _id: string;
    _type: string;
    [property: string]: unknown;
  }[];
  [property: string]: unknown;
}
```

A couple general rules are made apparent by the above structure:

- A segment is by nature recursive. Segments contain segments which contain segments. Thus, you are able to create a list item that contains bolded text along with a sub list with its on items.
- An underscore (`_`) prefixing any property represents a required property. `_id` and `_type` are the only required properties based on this specification.
- Additional properties are encouraged. If there are segments that require more information, the ability to add additional properties is baked into this specification as can be seen by the `[property: string]: unknown` property.

By taking these segments and placing them in an array (`[Segment, Segment, ...]`), you can build almost any rich-text content system. Let's take a deeper dive into each property.

### \_id (string)

The `_id` property represents a unique id for that segment. This allows different segments of the same type to be differentiated, and makes working with real-time interfaces easier.

This `_id` property is special in that, while part of the specification and a required field, some implementations may make more sense to leave this property out. For instance, some segments may not need an identifier. Thus, while it is advised to use it, a JSON object without the `_id` property on every segment can meet the requirements of this specification.

### \_type (string)

The `_type` property represents the type of that segment. There are no predefined types: this is left as an implementation decision. However, some examples could include `paragraph`, `text`, `list`, `heading1`, and `blockquote`.

### children (array)

The `children` property is optional. This property allows you to differentiate children of a segment and content of a segment. For instance, a sub list may operate as a child of a list item. However, that list item also contains normal text. Thus, the `children` property abstracts indirect content into its own property, allowing direct content to be placed in the `content` property.

### content (array)

The `content` property is optional, and contains more direct content that would not be placed on the `children` property. Again, these optional properties are listed in the specification, but the fact that they are optional means they do not necessarily need to be used. The difference between `children` and `content` is left vague to support more use cases of this specification.

### mods (array)

The `mods` property is optional. It provides a simple way to add modifiers to your text. For example, the modifiers `['bold', 'italic']` would specify that all text in the segment should be bold and italic. In a way, the `mods` property contains a list of types where their very definition is described by the type itself. However, if more information is needed, the property allows you to link a modifier definition using the associated `_id` from the `modDefs` array.

### modDefs (array)

The `modDefs` property is optional. It contains an array of modifier definitions. A modifier definition allows for more complex modifications than just simple text like `bold` and `italic`. Each definition requires an `_id` to be used in the `mods` property for identification and a `_type` to identify what kind of modifier definition it is. No predefined modifier definitions are provided in this specification, though an example could be a link which would contain a `_type` of `link` and an additional property called `href` with a url.

## Examples

Examples often make more sense than explanations. Below are several examples of how segments can be used:

### Paragraph with Rich Text

```json
{
  "_id": "6708c63d",
  "_type": "paragraph",
  "content": [
    {
      "_id": "a6e7de87",
      "_type": "text",
      "text": "I am a simple sentence with some "
    },
    {
      "_id": "302bfb59",
      "_type": "text",
      "text": "bold",
      "mods": ["bold"]
    },
    {
      "_id": "57c305e0",
      "_type": "text",
      "text": " text. "
    },
    {
      "_id": "d7267bf1",
      "_type": "text",
      "text": " Click Here",
      "mods": ["2bd91da7"],
      "modDefs": [
        {
          "_id": "2bd91da7",
          "_type": "link",
          "href": "https://github.com/pcbowers/segments",
          "newTab": true
        }
      ]
    },
    {
      "_id": "662e57bf",
      "_type": "text",
      "text": "for more information."
    }
  ]
}
```

Based on the example above, two segment types are used: `paragraph` and `text`. In fact, the `text` segment, while not part of the specification, does provide the backbone of most segment implementations. The `paragraph` segment contains a list of text segments that make up the following sentence:

> I am a simple sentence with some **bold** text. [Click Here](https://github.com/pcbowers/segments) for more information.

### List

```json
[
  {
    "_id": "bd05a896",
    "_type": "list",
    "type": "number",
    "start": 5,
    "content": [
      {
        "_id": "a34c7e21",
        "_type": "text",
        "text": "List Item 5"
      }
    ]
  },
  {
    "_id": "4aa415ed",
    "_type": "list",
    "type": "number",
    "start": 5,
    "content": [
      {
        "_id": "3185f99a",
        "_type": "text",
        "text": "List Item 6"
      }
    ],
    "children": [
      {
        "_id": "f3361d24",
        "_type": "list",
        "type": "lowerletter",
        "content": [
          {
            "_id": "e2144fd3",
            "_type": "text",
            "text": "Sub Item a"
          }
        ]
      },
      {
        "_id": "e2bbb879",
        "_type": "list",
        "type": "lowerletter",
        "content": [
          {
            "_id": "ba22c4d8",
            "_type": "text",
            "text": "Sub Item b"
          }
        ]
      }
    ]
  }
]
```

This is an example of a list using segments. As you can see, it uses the `type` property and the `start` property to dictate list type and where to start in the list respectively. The list itself contains two items with the second item containing a sub list with an additional two items. The list would render to something like this:

<ol start="5">
  <li>List Item 5</li>
  <li>List Item 6
    <ol type="a">
      <li>Sub Item a</li>
      <li>Sub Item b</li>
    </ol>
  </li>
</ol>

## Renderers

TODO

## Customizations

TODO

## Development

TODO

## TODO

TODO
