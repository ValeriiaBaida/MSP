#!/bin/bash

INPUT_DIR="./bpmn_models"
OUTPUT_DIR="./images/exported_bpmn"

mkdir -p "$OUTPUT_DIR"

npm install -g bpmn-to-image -y

for file in "$INPUT_DIR"/*.bpmn; do
  filename=$(basename -- "$file")
  filename_no_ext="${filename%.*}"
  output_file="$OUTPUT_DIR/$filename_no_ext.svg"

  if [ ! -e "$output_file" ] || [ "$file" -nt "$output_file" ]; then
    npx bpmn-to-image "$file":"$output_file"
    echo "Converted $file to $output_file"
  else
    echo "Skipped $file (up to date)"
  fi
done