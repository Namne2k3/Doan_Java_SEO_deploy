import React from 'react'
import "./menu.css"

const Menu = ({ category, menuList, brandList, handleSetBrand, handleSetCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Khám phá danh mục</h1>
            <p className="explore-menu-text">
                Các món đồ công nghệ di động ngày nay không chỉ là những thiết bị hữu ích mà còn là các phụ kiện thời trang thiết yếu. Chúng không ngừng được cải tiến để mang lại trải nghiệm tốt hơn, tiện ích hơn cho người dùng
            </p>
            <div className="explore-menu-list">
                {
                    menuList?.map((item, index) => {
                        return (
                            <div onClick={() => handleSetCategory(item.name)} key={index} className='explore-menu-list-item'>
                                <img src={item.image} alt='menu_image' />
                                <p>{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="explore-menu-list">
                {
                    brandList?.map((item, index) => {
                        return (
                            <div key={index} className='explore-menu-list-item'>
                                <button onClick={handleSetBrand} value={item.id} className='p-2 rounded'>{item.name}</button>
                            </div>
                        )
                    })
                }
            </div>
            <hr />
        </div>
    )
}

export default Menu