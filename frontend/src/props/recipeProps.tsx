type Ingridient = {
    name: string;
    quantity: number;
    unit: string;
}

export type Recipe = {
    name: string;
    ingridients: Ingridient[] | null;
    instructions: string | null;
    image: string | null;
}
