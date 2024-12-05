export interface Flat{
    id: number;
    address: string;
    rent:number;
    isAvailable: boolean;
}

export class FlatModel {
    private flats:Flat[] = [
        {id: 1, address: '123 Main St', rent: 300, isAvailable: true},
        {id: 2, address: '456 Elm St', rent: 250, isAvailable: false},
        {id: 3, address: '789 Oak St', rent: 400, isAvailable: true}
    ];

    getAllFlats(): Flat[] {
        return this.flats;
    }

    addFlat(flat:Flat):Flat {
        flat.id = this.flats.length + 1;
        this.flats.push(flat);
        return flat;
    }
}