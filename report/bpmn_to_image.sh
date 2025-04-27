#!/bin/bash

INPUT_DIR="./bpmn_models"
OUTPUT_DIR="./images/exported_bpmn"
LIST_FILE="./models_list.tex"

mkdir -p "$OUTPUT_DIR"

npm install -g bpmn-to-image -y

# Clean the old models list
echo "" > "$LIST_FILE"

for file in "$INPUT_DIR"/*.bpmn; do
  filename=$(basename -- "$file")
  filename_no_ext="${filename%.*}"
  output_file="$OUTPUT_DIR/$filename_no_ext.pdf"

  if [ ! -e "$output_file" ] || [ "$file" -nt "$output_file" ]; then
    npx bpmn-to-image "$file":"$output_file"
    echo "Converted $file to $output_file"
  else
    echo "Skipped $file (up to date)"
  fi

  # Add entry to models list
  echo "\\modelentry{$filename_no_ext}" >> "$LIST_FILE"
done