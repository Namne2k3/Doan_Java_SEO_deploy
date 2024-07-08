
import "./techitem.css"
import { images } from '../../assets/images'
import { useNavigate } from "react-router-dom"

const TechItem = ({ item: { id, name, price, description, image }, cartItems, addCartItem }) => {

    const navigate = useNavigate()

    const VNDONG = (number) => {
        return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    }

    // console.log(cartItems);

    return (
        <div className='tech-item'>
            <div className="tech-item-img-container">
                <img src={`/images/${image}`} className='tech-item-image' alt="tech_item_image" />
                {
                    !cartItems[id]
                        ?
                        <img className='add' onClick={() => addCartItem(id, name)} src={images.add_icon_white} alt='add_icon_white' />
                        :
                        <div className="tech-item-counter">
                            {/* <img onClick={() => removeFromCart(id)} src={images.remove_icon_red} alt="remove_icon_red" /> */}
                            <p>{cartItems[id]}</p>
                            <img onClick={() => addCartItem(id, name)} src={images.add_icon_green} alt="add_icon_green" />
                        </div>
                }
            </div>
            <div className="tech-item-info">
                <div className="tech-item-name-rating">
                    <p>{name}</p>
                    {/* <img src={images.rating_starts} alt="" /> */}
                </div>
                <p className="tech-item-desc">{description}</p>
                <p className="tech-item-price">{VNDONG(price)}</p>
                <button onClick={() => navigate(`/products/${id}`)} className="btn-details">Xem chi tiết</button>
            </div>
        </div>

    )
}

export default TechItem