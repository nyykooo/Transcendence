export type SliderSelectorProps = {
    min: number;
    max: number;
    value: number[];
    valueText: string;
    name: string;
    onChange: (event: Event, newValue: number[], activeThumb: number) => void;
}