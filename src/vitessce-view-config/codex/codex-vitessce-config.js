import {getHeadersWithoutContent} from "../../components/custom/js/functions";
import {getAssetsEndpoint, getAuth} from "../../config/config";

export const codex_config = (dataset_id) => (
    {
        "version": "1.0.16",
        "name": "CODEX-config",
        "description": "",
        "datasets": [
            {
                "uid": "A",
                "name": "SPRM",
                "files": [
                    {
                        "fileType": "anndata-cells.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`,
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
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    },
                    {
                        "fileType": "anndata-cell-sets.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`,
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
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    },
                    {
                        "fileType": "anndata-expression-matrix.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/anndata-zarr/reg001_expr-anndata.zarr`,
                        "options": {
                            "matrix": "X"
                        },
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    },
                    {
                        "fileType": "raster.json",
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
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        }
                    }
                ]
            }
        ],
        "coordinationSpace": {
            "dataset": {
                "A": "A"
            },
            "embeddingType": {
                "A": "t-SNE"
            }
        },
        "layout": [
            {
                "component": "description",
                "x": 0,
                "y": 8,
                "w": 3,
                "h": 4,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "layerController",
                "x": 0,
                "y": 0,
                "w": 3,
                "h": 8,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "spatial",
                "x": 3,
                "y": 0,
                "w": 4,
                "h": 8,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "scatterplot",
                "x": 7,
                "y": 0,
                "w": 3,
                "h": 8,
                "coordinationScopes": {
                    "dataset": "A",
                    "embeddingType": "A"
                }
            },
            {
                "component": "obsSets",
                "x": 10,
                "y": 5,
                "w": 2,
                "h": 7,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "featureList",
                "props": {
                    "variablesLabelOverride": "antigen"
                },
                "x": 10,
                "y": 0,
                "w": 2,
                "h": 5,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "heatmap",
                "props": {
                    "transpose": true,
                    "variablesLabelOverride": "antigen"
                },
                "x": 3,
                "y": 8,
                "w": 7,
                "h": 4,
                "coordinationScopes": {
                    "dataset": "A"
                }
            }
        ],
        "initStrategy": "auto"
    }
)