﻿export class ProductCategory {
    id: string;
    sequenceId: number;
    name: string;
    parentId: string;
    children: ProductCategory[];
}
