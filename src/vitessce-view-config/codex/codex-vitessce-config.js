import {get_headers, getHeaders} from "../../components/custom/js/functions";
import {getAssetsEndpoint, getAuth} from "../../config/config";

export const codex_config = (dataset_id) => ({
    "coordinationSpace": {
        "dataset": {
            "A": "A"
        },
        "embeddingType": {
            "A": "t-SNE"
        }
    },
    "datasets": [
        {
            "files": [
                {
                    "requestInit": {
                        "headers": get_headers()
                    },
                    "fileType": "anndata-cells.zarr",
                    "options": {
                        "factors": [
                            "obs/Cell K-Means [tSNE_All_Features]",
                            "obs/Cell K-Means [Mean-All-SubRegions] Expression",
                            "obs/Cell K-Means [Mean] Expression",
                            "obs/Cell K-Means [Shape-Vectors]",
                            "obs/Cell K-Means [Texture]",
                            "obs/Cell K-Means [Total] Expression",
                            "obs/Cell K-Means [Covariance] Expression"
                        ],
                        "mappings": {
                            "t-SNE": {
                                "dims": [
                                    0,
                                    1
                                ],
                                "key": "obsm/tsne"
                            }
                        },
                        "xy": "obsm/xy"
                    },
                    "type": "cells",
                    "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`
                },
                {
                    "fileType": "anndata-cell-sets.zarr",
                    "requestInit": {
                        "headers": get_headers()
                    },
                    "options": [
                        {
                            "groupName": "Cell K-Means [tSNE_All_Features]",
                            "setName": "obs/Cell K-Means [tSNE_All_Features]"
                        },
                        {
                            "groupName": "Cell K-Means [Mean-All-SubRegions] Expression",
                            "setName": "obs/Cell K-Means [Mean-All-SubRegions] Expression"
                        },
                        {
                            "groupName": "Cell K-Means [Mean] Expression",
                            "setName": "obs/Cell K-Means [Mean] Expression"
                        },
                        {
                            "groupName": "Cell K-Means [Shape-Vectors]",
                            "setName": "obs/Cell K-Means [Shape-Vectors]"
                        },
                        {
                            "groupName": "Cell K-Means [Texture]",
                            "setName": "obs/Cell K-Means [Texture]"
                        },
                        {
                            "groupName": "Cell K-Means [Total] Expression",
                            "setName": "obs/Cell K-Means [Total] Expression"
                        },
                        {
                            "groupName": "Cell K-Means [Covariance] Expression",
                            "setName": "obs/Cell K-Means [Covariance] Expression"
                        }
                    ],
                    "type": "cell-sets",
                    "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`
                },
                {
                    "fileType": "anndata-expression-matrix.zarr",
                    "requestInit": {
                        "headers": get_headers()
                    },
                    "options": {
                        "matrix": "X"
                    },
                    "type": "expression-matrix",
                    "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`
                },
                {
                    "fileType": "raster.json",
                    "requestInit": {
                        "headers": get_headers()
                    },
                    "options": {
                        "images": [
                            {
                                "metadata": {
                                    "isBitmask": false,
                                    "omeTiffOffsetsUrl": `${getAssetsEndpoint()}${dataset_id}/output_offsets/pipeline_output/expr/reg001_expr.offsets.json?token=${getAuth()}`
                                },
                                "name": "reg001_expr",
                                "type": "ome-tiff",
                                "url": `${getAssetsEndpoint()}${dataset_id}/ometiff-pyramids/pipeline_output/expr/reg001_expr.ome.tif?token=${getAuth()}`
                            },
                            {
                                "metadata": {
                                    "isBitmask": true,
                                    "omeTiffOffsetsUrl": `${getAssetsEndpoint()}${dataset_id}/output_offsets/pipeline_output/mask/reg001_mask.offsets.json?token=${getAuth()}`
                                },
                                "name": "reg001_mask",
                                "type": "ome-tiff",
                                "url": `${getAssetsEndpoint()}${dataset_id}/ometiff-pyramids/pipeline_output/mask/reg001_mask.ome.tif?token=${getAuth()}`
                            }
                        ],
                        "renderLayers": [
                            "reg001_expr",
                            "reg001_mask"
                        ],
                        "schemaVersion": "0.0.2",
                        "usePhysicalSizeScaling": false
                    },
                    "type": "raster"
                }
            ],
            "name": "SPRM",
            "uid": "A"
        }
    ],
    "description": "",
    "initStrategy": "auto",
    "layout": [
        {
            "component": "description",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 4,
            "w": 3,
            "x": 0,
            "y": 8
        },
        {
            "component": "layerController",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 8,
            "w": 3,
            "x": 0,
            "y": 0
        },
        {
            "component": "spatial",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 8,
            "w": 4,
            "x": 3,
            "y": 0
        },
        {
            "component": "scatterplot",
            "coordinationScopes": {
                "dataset": "A",
                "embeddingType": "A"
            },
            "h": 8,
            "w": 3,
            "x": 7,
            "y": 0
        },
        {
            "component": "cellSets",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 7,
            "w": 2,
            "x": 10,
            "y": 5
        },
        {
            "component": "genes",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 5,
            "props": {
                "variablesLabelOverride": "antigen"
            },
            "w": 2,
            "x": 10,
            "y": 0
        },
        {
            "component": "heatmap",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 4,
            "props": {
                "transpose": true,
                "variablesLabelOverride": "antigen"
            },
            "w": 7,
            "x": 3,
            "y": 8
        }
    ],
    "name": "CODEX-config",
    "version": "1.0.14"
})