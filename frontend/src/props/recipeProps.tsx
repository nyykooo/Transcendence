type ingredient = {
    name: string;
    quantity: number;
    unit: string;
}

export type Recipe = {
    name: string;
    ingredients: ingredient[];
    instructions: string;
    image: string | null;
    url: string | null;
}
