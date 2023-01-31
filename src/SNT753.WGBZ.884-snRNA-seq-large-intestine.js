export const rna_seq = {
    "coordinationSpace": {
        "dataset": {
            "A": "A"
        },
        "embeddingType": {
            "A": "UMAP"
        }
    },
    "datasets": [
        {
            "files": [
                {
                    "requestInit": {
                        "headers": {
                            "Authorization": "Bearer AgO3lbjrowwBbgg5J22OzbQdX4e4ljEX83D1jv03qVbrNlqMJ6UnC2BWB05Wdv4GNnp7XVwb5Py6nMI8yp0JgCgN5g5"
                        }
                    },
                    "fileType": "anndata-cells.zarr",
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
                    "type": "cells",
                    "url": "https://assets.dev.sennetconsortium.org/02a93db2ef7fd8acfc3f66eb70fd037a/hubmap_ui/anndata-zarr/secondary_analysis.zarr"
                },
                {
                    "fileType": "anndata-cell-sets.zarr",
                    "options": [
                        {
                            "groupName": "Leiden",
                            "setName": "obs/leiden"
                        }
                    ],
                    "type": "cell-sets",
                    "url": "https://assets.dev.sennetconsortium.org/02a93db2ef7fd8acfc3f66eb70fd037a/hubmap_ui/anndata-zarr/secondary_analysis.zarr"
                },
                {
                    "fileType": "anndata-expression-matrix.zarr",
                    "options": {
                        "geneAlias": "var/hugo_symbol",
                        "matrix": "X",
                        "matrixGeneFilter": "var/marker_genes_for_heatmap"
                    },
                    "type": "expression-matrix",
                    "url": "https://assets.dev.sennetconsortium.org/02a93db2ef7fd8acfc3f66eb70fd037a/hubmap_ui/anndata-zarr/secondary_analysis.zarr"
                }
            ],
            "name": "SNT753.WGBZ.884-snRNA-seq-large-intestine",
            "uid": "A"
        }
    ],
    "description": "",
    "initStrategy": "auto",
    "layout": [
        {
            "component": "scatterplot",
            "coordinationScopes": {
                "dataset": "A",
                "embeddingType": "A"
            },
            "h": 6,
            "w": 6,
            "x": 0,
            "y": 0
        },
        {
            "component": "cellSets",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 6,
            "w": 3,
            "x": 6,
            "y": 0
        },
        {
            "component": "genes",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 6,
            "w": 3,
            "x": 9,
            "y": 4
        },
        {
            "component": "cellSetExpression",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 6,
            "w": 5,
            "x": 7,
            "y": 6
        },
        {
            "component": "heatmap",
            "coordinationScopes": {
                "dataset": "A"
            },
            "h": 6,
            "w": 7,
            "x": 0,
            "y": 6
        }
    ],
    "name": "4a535055190943788c69d672ba1c8a71",
    "version": "1.0.14"
}