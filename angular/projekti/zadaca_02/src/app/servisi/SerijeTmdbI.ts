export interface SerijeTmdbI {
    page:number;
    results:Array<SerijaTmdbI>;
    total_pages:number;
    total_results:number;
    }
    export interface SerijaTmdbI {
    id:number;
    name:string,
    original_language:string;
    original_title:string;
    overview:string;
    popularity:number;
    poster_path:string;
    homepage:string;
    }