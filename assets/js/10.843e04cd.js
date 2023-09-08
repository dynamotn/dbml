(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{291:function(e,t,a){"use strict";a.r(t);var n=a(14),s=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"dbml-full-syntax-docs"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dbml-full-syntax-docs"}},[e._v("#")]),e._v(" DBML - Full Syntax Docs")]),e._v(" "),a("p",[e._v("DBML (database markup language) is a simple, readable DSL language designed to define database structures. This page\noutlines the full syntax documentations of DBML.")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#project-definition"}},[e._v("Project Definition")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#schema-definition"}},[e._v("Schema Definition")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#public-schema"}},[e._v("Public Schema")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#table-definition"}},[e._v("Table Definition")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#table-alias"}},[e._v("Table Alias")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#table-notes"}},[e._v("Table Notes")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#table-settings"}},[e._v("Table Settings")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#column-definition"}},[e._v("Column Definition")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#column-settings"}},[e._v("Column Settings")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#default-value"}},[e._v("Default Value")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#index-definition"}},[e._v("Index Definition")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#index-settings"}},[e._v("Index Settings")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#relationships-foreign-key-definitions"}},[e._v("Relationships & Foreign Key Definitions")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#relationship-settings"}},[e._v("Relationship settings")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#many-to-many-relationship"}},[e._v("Many-to-many relationship")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#comments"}},[e._v("Comments")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#note-definition"}},[e._v("Note Definition")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#project-notes"}},[e._v("Project Notes")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#table-notes"}},[e._v("Table Notes")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#column-notes"}},[e._v("Column Notes")])])])]),e._v(" "),a("li",[a("a",{attrs:{href:"#multi-line-string"}},[e._v("Multi-line String")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#enum-definition"}},[e._v("Enum Definition")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#tablegroup"}},[e._v("TableGroup")])]),e._v(" "),a("li",[a("a",{attrs:{href:"#syntax-consistency"}},[e._v("Syntax Consistency")])])]),e._v(" "),a("h5",{attrs:{id:"take-a-look-at-an-example-below"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#take-a-look-at-an-example-below"}},[e._v("#")]),e._v(" Take a look at an example below:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users {\n    id integer\n    username varchar\n    role varchar\n    created_at timestamp\n}\n\nTable posts {\n    id integer [primary key]\n    title varchar\n    body text [note: 'Content of the post']\n    user_id integer\n    created_at timestamp\n}\n\nRef: posts.user_id > users.id // many-to-one\n")])])]),a("h2",{attrs:{id:"project-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#project-definition"}},[e._v("#")]),e._v(" Project Definition")]),e._v(" "),a("p",[e._v("You can give overall description of the project.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Project project_name {\n  database_type: 'PostgreSQL'\n  Note: 'Description of the project'\n}\n")])])]),a("h2",{attrs:{id:"schema-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#schema-definition"}},[e._v("#")]),e._v(" Schema Definition")]),e._v(" "),a("p",[e._v("A new schema will be defined as long as it contains any table or enum.")]),e._v(" "),a("p",[e._v("For example, the following code will define a new schema "),a("code",[e._v("core")]),e._v(" along with a table "),a("code",[e._v("user")]),e._v(" placed inside it")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table core.user {\n    ...\n}\n")])])]),a("h3",{attrs:{id:"public-schema"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#public-schema"}},[e._v("#")]),e._v(" Public Schema")]),e._v(" "),a("p",[e._v("By default, any "),a("strong",[e._v("table")]),e._v(", "),a("strong",[e._v("relationship")]),e._v(", or "),a("strong",[e._v("enum")]),e._v(" definition that omits "),a("code",[e._v("schema_name")]),e._v(" will be considered to belong to the "),a("code",[e._v("public")]),e._v(" schema.")]),e._v(" "),a("h2",{attrs:{id:"table-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#table-definition"}},[e._v("#")]),e._v(" Table Definition")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v('// table belonged to default "public" schema\nTable table_name {\n    column_name column_type [column_settings]\n}\n\n// table belonged to a schema\nTable schema_name.table_name {\n    column_name column_type [column_settings]\n}\n')])])]),a("ul",[a("li",[e._v("(Optional) title of database schema is listed as "),a("code",[e._v("schema_name")]),e._v(". If omitted, "),a("code",[e._v("schema_name")]),e._v(" will default to "),a("code",[e._v("public")])]),e._v(" "),a("li",[e._v("title of database table is listed as "),a("code",[e._v("table_name")])]),e._v(" "),a("li",[e._v("name of the column is listed as "),a("code",[e._v("column_name")])]),e._v(" "),a("li",[e._v("type of the data in the column listed as "),a("code",[e._v("column_type")]),e._v(" "),a("ul",[a("li",[e._v("supports all data types, as long as it is a single word (remove all spaces in the data type). Example, JSON, JSONB, decimal(1,2), etc.")])])]),e._v(" "),a("li",[e._v("list is wrapped in "),a("code",[e._v("curly brackets {}")]),e._v(", for indexes, constraints and table definitions.")]),e._v(" "),a("li",[e._v("settings are wrapped in "),a("code",[e._v("square brackets []")])]),e._v(" "),a("li",[e._v("string value is be wrapped in a "),a("code",[e._v("single quote as 'string'")])]),e._v(" "),a("li",[a("code",[e._v("column_name")]),e._v(" can be stated in just plain text, or wrapped in a "),a("code",[e._v('double quote as "column name"')])])]),e._v(" "),a("h3",{attrs:{id:"table-alias"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#table-alias"}},[e._v("#")]),e._v(" Table Alias")]),e._v(" "),a("p",[e._v("You can alias the table, and use them in the references later on.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table very_long_user_table as U {\n    ...\n}\n\nRef: U.id < posts.user_id\n")])])]),a("h3",{attrs:{id:"table-notes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#table-notes"}},[e._v("#")]),e._v(" Table Notes")]),e._v(" "),a("p",[e._v("You can add notes to the table, and refer to them in the visual plane.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users {\n    id integer\n    status varchar [note: 'status']\n\n    Note: 'Stores user data'\n}\n")])])]),a("h3",{attrs:{id:"table-settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#table-settings"}},[e._v("#")]),e._v(" Table Settings")]),e._v(" "),a("p",[e._v("Settings are all defined within square brackets: "),a("code",[e._v("[setting1: value1, setting2: value2, setting3, setting4]")])]),e._v(" "),a("p",[e._v("Each setting item can take in 2 forms: "),a("code",[e._v("Key: Value")]),e._v(" or "),a("code",[e._v("keyword")]),e._v(", similar to that of Python function parameters.")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("headercolor: <color_code>")]),e._v(": change the table header color.")])]),e._v(" "),a("p",[e._v("Example,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users [headercolor: #3498DB] {\n    id integer [primary key]\n    username varchar(255) [not null, unique]\n}\n")])])]),a("h2",{attrs:{id:"column-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#column-definition"}},[e._v("#")]),e._v(" Column Definition")]),e._v(" "),a("h3",{attrs:{id:"column-settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#column-settings"}},[e._v("#")]),e._v(" Column Settings")]),e._v(" "),a("p",[e._v("Each column can take have optional settings, defined in square brackets like:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table buildings {\n    ...\n    address varchar(255) [unique, not null, note: 'to include unit number']\n    id integer [ pk, unique, default: 123, note: 'Number' ]\n}\n")])])]),a("p",[e._v("The list of column settings you can use:")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("note: 'string to add notes'")]),e._v(": add a metadata note to this column")]),e._v(" "),a("li",[a("code",[e._v("primary key")]),e._v(" or "),a("code",[e._v("pk")]),e._v(": mark a column as primary key. For composite primary key, refer to the 'Indexes' section")]),e._v(" "),a("li",[a("code",[e._v("null")]),e._v(" or "),a("code",[e._v("not null")]),e._v(": mark a column null or not null")]),e._v(" "),a("li",[a("code",[e._v("unique")]),e._v(": mark the column unique")]),e._v(" "),a("li",[a("code",[e._v("default: some_value")]),e._v(": set a default value of the column, please refer to the 'Default Value' section below")]),e._v(" "),a("li",[a("code",[e._v("increment")]),e._v(": mark the column as auto-increment")])]),e._v(" "),a("p",[a("strong",[e._v("Note:")]),e._v(" You can use a workaround for un-supported settings by adding the setting name into the column type name, such as "),a("code",[e._v("id “bigint unsigned” [pk]")])]),e._v(" "),a("h3",{attrs:{id:"default-value"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#default-value"}},[e._v("#")]),e._v(" Default Value")]),e._v(" "),a("p",[e._v("You can set default value as:")]),e._v(" "),a("ul",[a("li",[e._v("number value starts blank: "),a("code",[e._v("default: 123")]),e._v(" or "),a("code",[e._v("default: 123.456")])]),e._v(" "),a("li",[e._v("string value starts with single quotes: "),a("code",[e._v("default: 'some string value'")])]),e._v(" "),a("li",[e._v("expression value is wrapped with parenthesis: "),a("code",[e._v("default: `now() - interval '5 days'`")])]),e._v(" "),a("li",[e._v("boolean (true/false/null): "),a("code",[e._v("default: false")]),e._v(" or "),a("code",[e._v("default: null")])])]),e._v(" "),a("p",[e._v("Example,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users {\n    id integer [primary key]\n    username varchar(255) [not null, unique]\n    full_name varchar(255) [not null]\n    gender varchar(1) [not null]\n    source varchar(255) [default: 'direct']\n    created_at timestamp [default: `now()`]\n    rating integer [default: 10]\n}\n")])])]),a("h2",{attrs:{id:"index-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#index-definition"}},[e._v("#")]),e._v(" Index Definition")]),e._v(" "),a("p",[e._v("Indexes allow users to quickly locate and access the data. Users can define single or multi-column indexes.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table bookings {\n  id integer\n  country varchar\n  booking_date date\n  created_at timestamp\n\n  indexes {\n      (id, country) [pk] // composite primary key\n      created_at [name: 'created_at_index', note: 'Date']\n      booking_date\n      (country, booking_date) [unique]\n      booking_date [type: hash]\n      (`id*2`)\n      (`id*3`,`getdate()`)\n      (`id*3`,id)\n  }\n}\n")])])]),a("p",[e._v("There are 3 types of index definitions:")]),e._v(" "),a("ul",[a("li",[e._v("Index with single field (with index name): "),a("code",[e._v("CREATE INDEX created_at_index on users (created_at)")])]),e._v(" "),a("li",[e._v("Index with multiple fields (composite index): "),a("code",[e._v("CREATE INDEX on users (created_at, country)")])]),e._v(" "),a("li",[e._v("Index with an expression: "),a("code",[e._v("CREATE INDEX ON films ( first_name + last_name )")])]),e._v(" "),a("li",[e._v("(bonus) Composite index with expression: "),a("code",[e._v("CREATE INDEX ON users ( country, (lower(name)) )")])])]),e._v(" "),a("h3",{attrs:{id:"index-settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#index-settings"}},[e._v("#")]),e._v(" Index Settings")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("type")]),e._v(": type of index (btree, gin, gist, hash depending on DB). For now, only type btree and hash are accepted.")]),e._v(" "),a("li",[a("code",[e._v("name")]),e._v(": name of index")]),e._v(" "),a("li",[a("code",[e._v("unique")]),e._v(": unique index")]),e._v(" "),a("li",[a("code",[e._v("pk")]),e._v(": primary key")])]),e._v(" "),a("h2",{attrs:{id:"relationships-foreign-key-definitions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#relationships-foreign-key-definitions"}},[e._v("#")]),e._v(" Relationships & Foreign Key Definitions")]),e._v(" "),a("p",[e._v("Relationships are used to define foreign key constraints between tables across schemas.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table posts {\n    id integer [primary key]\n    user_id integer [ref: > users.id] // many-to-one\n}\n\n// or this\nTable users {\n    id integer [ref: < posts.user_id, ref: < reviews.user_id] // one to many\n}\n\n// The space after '<' is optional\n")])])]),a("p",[e._v("There are 4 types of relationships: one-to-one, one-to-many, many-to-one and many-to-many")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("<")]),e._v(": one-to-many. E.g: "),a("code",[e._v("users.id < posts.user_id")])]),e._v(" "),a("li",[a("code",[e._v(">")]),e._v(": many-to-one. E.g: "),a("code",[e._v("posts.user_id > users.id")])]),e._v(" "),a("li",[a("code",[e._v("-")]),e._v(": one-to-one. E.g: "),a("code",[e._v("users.id - user_infos.user_id")])]),e._v(" "),a("li",[a("code",[e._v("<>")]),e._v(": many-to-many. E.g: "),a("code",[e._v("authors.id <> books.id")])])]),e._v(" "),a("p",[e._v("In DBML, there are 3 syntaxes to define relationships:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("//Long form\nRef name_optional {\n  schema1.table1.column1 < schema2.table2.column2\n}\n\n//Short form:\nRef name_optional: schema1.table1.column1 < schema2.table2.column2\n\n// Inline form\nTable schema2.table2 {\n    id integer\n    column2 integer [ref: > schema1.table1.column1]\n}\n")])])]),a("p",[a("strong",[e._v("Note:")]),e._v(" if "),a("code",[e._v("schema_name")]),e._v(" prefix is omitted, it'll default to "),a("code",[e._v("public")]),e._v(" schema")]),e._v(" "),a("p",[a("strong",[e._v("Composite foreign keys:")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Ref: merchant_periods.(merchant_id, country_code) > merchants.(id, country_code)\n")])])]),a("p",[a("strong",[e._v("Cross-schema relationship:")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table core.users {\n    id integer [pk]\n}\n\nTable blogging.posts {\n    id integer [pk]\n    user_id integer [ref: > core.users.id]\n}\n\n// or this\nRef: blogging.posts.user_id > core.users.id\n")])])]),a("h3",{attrs:{id:"relationship-settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#relationship-settings"}},[e._v("#")]),e._v(" Relationship settings")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Ref: products.merchant_id > merchants.id [delete: cascade, update: no action]\n")])])]),a("ul",[a("li",[a("code",[e._v("delete / update: cascade | restrict | set null | set default | no action")]),a("br"),e._v("\nDefine referential actions. Similar to "),a("code",[e._v("ON DELETE/UPDATE CASCADE/...")]),e._v(" in SQL.")])]),e._v(" "),a("p",[a("em",[e._v("Relationship settings are not supported for inline form ref.")])]),e._v(" "),a("h3",{attrs:{id:"many-to-many-relationship"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#many-to-many-relationship"}},[e._v("#")]),e._v(" Many-to-many relationship")]),e._v(" "),a("p",[e._v("There're two ways to represent many-to-many relationship:")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("Using a single many-to-many relationship ("),a("code",[e._v("<>")]),e._v(").")])]),e._v(" "),a("li",[a("p",[e._v("Using 2 many-to-one relationships ("),a("code",[e._v(">")]),e._v(" and "),a("code",[e._v("<")]),e._v("). For more information, please refer to "),a("a",{attrs:{href:"https://www.holistics.io/blog/dbdiagram-io-many-to-many-relationship-diagram-generator-script/",target:"_blank",rel:"noopener noreferrer"}},[e._v("https://www.holistics.io/blog/dbdiagram-io-many-to-many-relationship-diagram-generator-script/"),a("OutboundLink")],1)])])]),e._v(" "),a("p",[e._v("Beside presentation aspect, the main differece between these two approaches is how the relationship will be mapped into physical design when exporting to SQL.")]),e._v(" "),a("h2",{attrs:{id:"comments"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#comments"}},[e._v("#")]),e._v(" Comments")]),e._v(" "),a("p",[a("strong",[e._v("Single-line Comments")])]),e._v(" "),a("p",[e._v("You can comment in your code using "),a("code",[e._v("//")]),e._v(", so it is easier for you to review the code later.")]),e._v(" "),a("p",[e._v("Example,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("// order_items refer to items from that order\n")])])]),a("p",[a("strong",[e._v("Multi-line Comments")])]),e._v(" "),a("p",[e._v("You can also put comment spanning multiple lines in your code by putting inside "),a("code",[e._v("/*")]),e._v(" and "),a("code",[e._v("*/")]),e._v(".")]),e._v(" "),a("p",[e._v("Example,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("/*\n    This is a\n    Multi-lines\n    comment\n*/\n")])])]),a("h2",{attrs:{id:"note-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#note-definition"}},[e._v("#")]),e._v(" Note Definition")]),e._v(" "),a("p",[e._v("Note allows users to give description for a particular DBML element.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users {\n  id int [pk]\n  name varchar\n\n  Note: 'This is a note of this table'\n  // or\n  Note {\n    'This is a note of this table'\n  }\n}\n")])])]),a("p",[e._v("Note's value is a string. If your note spans over multiple lines, you can use "),a("a",{attrs:{href:"#multi-line-string"}},[e._v("multi-line string")]),e._v(" to define your note.")]),e._v(" "),a("h3",{attrs:{id:"project-notes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#project-notes"}},[e._v("#")]),e._v(" Project Notes")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Project DBML {\n  Note: '''\n    # DBML - Database Markup Language\n    DBML (database markup language) is a simple, readable DSL language designed to define database structures.\n\n    ## Benefits\n    \n    * It is simple, flexible and highly human-readable\n    * It is database agnostic, focusing on the essential database structure definition without worrying about the detailed syntaxes of each database\n    * Comes with a free, simple database visualiser at [dbdiagram.io](http://dbdiagram.io)\n  '''\n}\n")])])]),a("h3",{attrs:{id:"table-notes-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#table-notes-2"}},[e._v("#")]),e._v(" Table Notes")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table users {\n  id int [pk]\n  name varchar\n\n  Note: 'Stores user data'\n}\n")])])]),a("h3",{attrs:{id:"column-notes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#column-notes"}},[e._v("#")]),e._v(" Column Notes")]),e._v(" "),a("p",[e._v("You can add notes to your columns, so you can easily refer to it when hovering over the column in the diagram canvas.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("column_name column_type [note: 'replace text here']\n")])])]),a("p",[e._v("Example,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Table orders {\n    status varchar [\n    note: '\n    💸 1 = processing, \n    ✔️ 2 = shipped, \n    ❌ 3 = cancelled,\n    😔 4 = refunded\n    ']\n} \n")])])]),a("h2",{attrs:{id:"multi-line-string"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#multi-line-string"}},[e._v("#")]),e._v(" Multi-line String")]),e._v(" "),a("p",[e._v("Multiline string will be defined between triple single quote "),a("code",[e._v("'''")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("Note: '''\n  This is a block string\n  This string can spans over multiple lines.\n'''\n")])])]),a("ul",[a("li",[a("p",[e._v("Line breaks: <enter> key")])]),e._v(" "),a("li",[a("p",[e._v("Line continuation: "),a("code",[e._v("\\")]),e._v(" backslash")])]),e._v(" "),a("li",[a("p",[e._v("Escaping characters:")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("\\")]),e._v(": using double backslash "),a("code",[e._v("\\\\")])]),e._v(" "),a("li",[a("code",[e._v("'''")]),e._v(": using "),a("code",[e._v("\\'''")])])])]),e._v(" "),a("li",[a("p",[e._v("The number of spaces you use to indent a block string will be the minimum number of leading spaces among all lines. The parser will automatically remove the number of indentation spaces in the final output. The result of the above example will be:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("This is a block string\nThis string can spans over multiple lines.\n")])])])])]),e._v(" "),a("h2",{attrs:{id:"enum-definition"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#enum-definition"}},[e._v("#")]),e._v(" Enum Definition")]),e._v(" "),a("p",[a("code",[e._v("Enum")]),e._v(" allows users to define different values of a particular column.\nWhen hovering over the column in the canvas, the enum values will be displayed.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("// enum belonged to default \"public\" schema\nenum job_status {\n    created [note: 'Waiting to be processed']\n    running\n    done\n    failure\n}\n\n// enum belonged to a schema\nenum v2.job_status {\n    ...\n}\n\nTable jobs {\n    id integer\n    status job_status\n    status_v2 v2.job_status\n} \n")])])]),a("p",[a("strong",[e._v("Note:")]),e._v(" if "),a("code",[e._v("schema_name")]),e._v(" prefix is omitted, it'll default to "),a("code",[e._v("public")]),e._v(" schema")]),e._v(" "),a("p",[e._v("If your enum values contain spaces or other special characters you can use double quotes.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v('enum grade {\n    "A+"\n    "A"\n    "A-"\n    "Not Yet Set"\n}\n')])])]),a("h2",{attrs:{id:"tablegroup"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tablegroup"}},[e._v("#")]),e._v(" TableGroup")]),e._v(" "),a("p",[a("code",[e._v("TableGroup")]),e._v(" allows users to group the related or associated tables together.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("TableGroup tablegroup_name { // tablegroup is case-insensitive.\n    table1 \n    table2 \n    table3\n}\n\n//example\nTableGroup e-commerce1 {\n    merchants\n    countries\n} \n")])])]),a("h2",{attrs:{id:"syntax-consistency"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#syntax-consistency"}},[e._v("#")]),e._v(" Syntax Consistency")]),e._v(" "),a("p",[e._v("DBML is the standard language for database and the syntax is consistent to provide clear and extensive functions.")]),e._v(" "),a("ul",[a("li",[e._v("curly brackets "),a("code",[e._v("{}")]),e._v(": grouping for indexes, constraints and table definitions")]),e._v(" "),a("li",[e._v("square brackets "),a("code",[e._v("[]")]),e._v(": settings")]),e._v(" "),a("li",[e._v("forward slashes "),a("code",[e._v("//")]),e._v(": comments")]),e._v(" "),a("li",[a("code",[e._v("column_name")]),e._v(" is stated in just plain text")]),e._v(" "),a("li",[e._v("single quote as "),a("code",[e._v("'string'")]),e._v(": string value")]),e._v(" "),a("li",[e._v("double quote as "),a("code",[e._v('"column name"')]),e._v(": quoting variable")]),e._v(" "),a("li",[e._v("triple quote as "),a("code",[e._v("'''multi-line string'''")]),e._v(": multi-line string value")]),e._v(" "),a("li",[e._v("backtick "),a("code",[e._v("`")]),e._v(": function expression")])])])}),[],!1,null,null,null);t.default=s.exports}}]);