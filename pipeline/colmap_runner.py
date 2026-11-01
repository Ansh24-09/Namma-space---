

import os
import sys
import subprocess
import argparse
from pathlib import Path

def run_colmap_pipeline(image_dir, workspace_dir, camera_model="SIMPLE_RADIAL", matching_type="sequential"):
    os.makedirs(workspace_dir, exist_ok=True)
    database_path = Path(workspace_dir) / "database.db"
    sparse_dir = Path(workspace_dir) / "sparse"
    os.makedirs(sparse_dir, exist_ok=True)

    print(f"Starting COLMAP SfM on images in: {image_dir}")

    cmd_feat = [
        "colmap", "feature_extractor",
        "--database_path", str(database_path),
        "--image_path", str(image_dir),
        "--ImageReader.camera_model", camera_model,
        "--ImageReader.single_camera", "1"
    ]
    print(f"[1/3] Extracting SIFT Features...")
    try:
        subprocess.run(cmd_feat, check=True)
    except FileNotFoundError:
        print("COLMAP binary not found on system path. Please ensure COLMAP is installed.")
        return False

    if matching_type == "sequential":
        cmd_match = [
            "colmap", "sequential_matcher",
            "--database_path", str(database_path),
            "--SequentialMatching.overlap", "10",
            "--SequentialMatching.loop_detection", "1"
        ]
    else:
        cmd_match = [
            "colmap", "exhaustive_matcher",
            "--database_path", str(database_path)
        ]
    
    print(f"[2/3] Matching Features ({matching_type})...")
    subprocess.run(cmd_match, check=True)

    cmd_map = [
        "colmap", "mapper",
        "--database_path", str(database_path),
        "--image_path", str(image_dir),
        "--output_path", str(sparse_dir)
    ]
    print(f"[3/3] Running Sparse Bundle Adjustment (Mapper)...")
    subprocess.run(cmd_map, check=True)

    print(f"✓ COLMAP reconstruction completed. Output saved in {sparse_dir}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="COLMAP SfM Automated Pipeline")
    parser.add_argument("--images", default="./test_dataset/output/images")
    parser.add_argument("--workspace", default="./test_dataset/output/colmap")
    parser.add_argument("--matcher", default="sequential", choices=["sequential", "exhaustive"])
    args = parser.parse_args()
    run_colmap_pipeline(args.images, args.workspace, matching_type=args.matcher)

