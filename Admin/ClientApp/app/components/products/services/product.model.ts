export class ProductList {
    public id: string;
    public article: string;
    public name: string;
    public published: boolean;
    public price: number;
    public unitsInStock: number;
    public isDiscount: boolean;
    public productCategoryName: string;
}

export class Product {
    public id: string;
    public article: string;
    public barCode: string;
    public name: string;
    public brand: string;
    public manufactures: string;
    public shortDescription: string;
    public description: string;
    public image: string;
    public published: boolean;
    public price: number;
    public discount: boolean;
    public discountToDateTime: Date;
    public discountPrice: number;
    public discountAllowed: boolean;
    public maxDiscountPercentage: number;
    public metaTitle: string;
    public metaDescription: string;
    public metaKeywords: string;
    public width: number;
    public height: number;
    public length: number;
    public weight: number;
    public productCategoryId: string;
    public unitsInStock: number;
    public images: string[];
}