# Define the `products` table.
DEFINE TABLE IF NOT EXISTS products SCHEMAFULL;

DEFINE FIELD IF NOT EXISTS title ON TABLE products TYPE string
  ASSERT string::len($value) > 0;

DEFINE FIELD IF NOT EXISTS description ON TABLE products TYPE string
  ASSERT string::len($value) > 0;

DEFINE FIELD IF NOT EXISTS thumbnail ON TABLE products TYPE string
  ASSERT string::is::url($value);

DEFINE FIELD IF NOT EXISTS vector ON TABLE products TYPE array<float>
  ASSERT array::len($value) = 1536;

DEFINE INDEX IF NOT EXISTS vector_index ON products
  FIELDS vector
  MTREE DIMENSION 1536
  DIST COSINE;

# Search for products using embeddings.
DEFINE FUNCTION OVERWRITE fn::search_for_products($input_vector: array<float>) {
  LET $products = (
    SELECT
      title,
      description,
      thumbnail
    FROM products
    WHERE vector <|5|> $input_vector
  );
  RETURN $products;
};
