#!/bin/bash
# This script converts BPMN files to images using bpmn-to-image and generates a LaTeX list of the models.
# This ensures that all BPMN files are displayed in the report.

INPUT_DIR="./bpmn_models"
OUTPUT_DIR="./images/exported_bpmn"
LIST_FILE="./models_list.tex"

mkdir -p "$OUTPUT_DIR"

# Clean the old models list
echo "" > "$LIST_FILE"

for file in "$INPUT_DIR"/*.bpmn; do
  filename=$(basename -- "$file")
  filename_no_ext="${filename%.*}"
  output_file="$OUTPUT_DIR/$filename_no_ext.pdf"

  # Generate PDF if it is missing or outdated
  if [ ! -e "$output_file" ] || [ "$file" -nt "$output_file" ]; then
    npx --yes bpmn-to-image "$file":"$output_file"
    echo "Converted $file to $output_file"
  else
    echo "Skipped $file (up to date)"
  fi

  # Add entry to models list
  echo "\\modelentry{$filename_no_ext}" >> "$LIST_FILE"
done