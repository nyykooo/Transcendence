type ingredient = {
    name: string;
    quantity: number;
    unit: string;
}

export type InstructionGroup = {
    title: string;
    subSteps: string[];
}

export type Recipe = {
    name: string;
    ingredients: ingredient[];
    instructions: InstructionGroup[];
    image: string | null;
    url: string | null;
    liked: number;
    viewed: number;
    likedByUser?: boolean;
    diet?: string;
    cost?: number;
    portions?: number;
    prep_time?: number;
    cooking_time?: number;
    author?: string;
}
