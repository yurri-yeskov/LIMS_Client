const StockField = () => {
    return (
        <div className="row mx-0">
            <div className="col-lg-6">
                <label htmlFor="stock" className="control-label">Stock Sample</label>
                <div className="col-lg-12 px-0">
                    <select className="form-control" onChange={this.handleChangeStock.bind(this)}>
                        {
                            this.state.stock_data.map((d, index) => (
                                <option key={index} value={d.value}>{d.label}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className="col-lg-6">
                <label htmlFor="weight" className="control-label">Weight</label>
                <div className="col-lg-12 px-0">
                    <input type="text" className="form-control" />
                </div>
            </div>
        </div>
    )
}

export default StockField