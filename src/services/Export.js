import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const VNDONG = (number) => {
    return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

const exportToPDF = (orders) => {
    const docDefinition = {
        content: [
            // Lặp qua từng order và tạo nội dung cho PDF
            ...orders.map((order, index) => ({
                text: `Thông tin đơn hàng #${index + 1}`,
                style: 'header',
                margin: [0, 10, 0, 10] // top, right, bottom, left
            })),

            ...orders.map((order, index) => {
                let status = "";

                if (order.status === "pending") {
                    status = "Đang xử lý"
                } else if (order.status === "paid") {
                    status = "Đã thanh toán"
                } else if (order.status === "processed") {
                    status = "Đang xử lý"
                } else {
                    status = "Đã giao"
                }

                return ({
                    style: 'tableExample',
                    table: {
                        body: [
                            ['Mã đơn hàng', order.id],
                            ['Tên người mua', order.user ? order.user.username : ''],
                            ['Chi tiết', order.details.map(detail => detail.product ? detail.product.name + ' x ' + detail.quantity : '').join(', ')],
                            ['Email', order.email],
                            ['Ngày đặt hàng', moment(order.orderDate).format('DD-MM-YYYY HH:mm:ss')],
                            ['Tổng tiền', VNDONG(order.totalAmount)],
                            ['SĐT', order.phone],
                            ['Trạng thái đơn hàng', status],
                            ['Địa chỉ', order.shippingAddress],
                            ['Phương thức thanh toán', order.paymentMethod],
                            ['Ngày tạo', moment(order.createdAt).format('DD-MM-YYYY HH:mm:ss')],
                            ['Ngày cập nhật', moment(order.updatedAt).format('DD-MM-YYYY HH:mm:ss')],
                        ]
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                        }
                    }
                })
            })

        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center'
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
        },
        defaultStyle: {
            font: 'Roboto' // Sử dụng font chữ bạn đã nhúng
        }
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('don_hang.pdf');
};



export {
    exportToPDF
}