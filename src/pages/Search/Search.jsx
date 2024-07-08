import React from 'react'
import "./Search.css"
import TechDisplay from '../../components/TechDisplay/TechDisplay'
import { useParams } from 'react-router-dom'
const Search = () => {

    const params = useParams();
    const { search } = params;

    return (
        <div>
            <TechDisplay title='Kết quả tìm kiếm' search={search} />
        </div>
    )
}

export default Search