type ingredient = {
    name: string;
    quantity: number;
    unit: string;
}

export type Recipe = {
    name: string;
    ingredients: ingredient[] | null;
    instructions: string | null;
    image: string | null;
}
