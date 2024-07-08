import React from 'react'
import "./Search.css"
import TechDisplay from '../../components/TechDisplay/TechDisplay'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
const Search = () => {

    const params = useParams();
    const { search } = params;

    return (
        <div>
            <Helmet>
                <title>Kết quả tìm kiếm: {search}</title>
                <meta name='description' content={search} />
                <link rel="canonical" href={`https://justtechshop.netlify.app/search`} />
            </Helmet>
            <TechDisplay title='Kết quả tìm kiếm' search={search} />
        </div>
    )
}

export default Search