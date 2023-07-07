import {getHeadersWithoutContent} from "../../components/custom/js/functions";
import {getAssetsEndpoint} from "../../config/config";

export const rna_seq = (dataset_id) => (
    {
        "version": "1.0.16",
        "name": "rna-seq-config",
        "description": "",
        "datasets": [
            {
                "uid": "A",
                "name": "SNT753.WGBZ.884",
                "files": [
                    {
                        "fileType": "anndata-cells.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`,
                        "options": {
                            "factors": [
                                "obs/marker_gene_0",
                                "obs/marker_gene_1",
                                "obs/marker_gene_2",
                                "obs/marker_gene_3",
                                "obs/marker_gene_4"
                            ],
                            "mappings": {
                                "UMAP": {
                                    "dims": [
                                        0,
                                        1
                                    ],
                                    "key": "obsm/X_umap"
                                }
                            }
                        },
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    },
                    {
                        "fileType": "anndata-cell-sets.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`,
                        "options": [
                            {
                                "groupName": "Leiden",
                                "setName": "obs/leiden"
                            }
                        ],
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    },
                    {
                        "fileType": "anndata-expression-matrix.zarr",
                        "url": `${getAssetsEndpoint()}${dataset_id}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`,
                        "options": {
                            "geneAlias": "var/hugo_symbol",
                            "matrix": "X",
                            "matrixGeneFilter": "var/marker_genes_for_heatmap"
                        },
                        "requestInit": {
                            "headers": getHeadersWithoutContent()
                        },
                    }
                ]
            }
        ],
        "coordinationSpace": {
            "dataset": {
                "A": "A"
            },
            "embeddingType": {
                "A": "UMAP"
            }
        },
        "layout": [
            {
                "component": "scatterplot",
                "x": 0,
                "y": 0,
                "w": 9,
                "h": 6,
                "coordinationScopes": {
                    "dataset": "A",
                    "embeddingType": "A"
                }
            },
            {
                "component": "obsSets",
                "x": 9,
                "y": 0,
                "w": 3,
                "h": 3,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "featureList",
                "x": 9,
                "y": 4,
                "w": 3,
                "h": 3,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "obsSetFeatureValueDistribution",
                "x": 7,
                "y": 6,
                "w": 5,
                "h": 4,
                "coordinationScopes": {
                    "dataset": "A"
                }
            },
            {
                "component": "heatmap",
                "x": 0,
                "y": 6,
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