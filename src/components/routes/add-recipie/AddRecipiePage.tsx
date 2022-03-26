function AddRecipiePage() {
    const confirmAdd = () => {}
    return (
        <div className="AddRecipiePage">
            <form onSubmit={confirmAdd}>
                <label htmlFor="recipie-name">Name</label>
                <input type="text" name="recipie-name" id="recipie-name" />
                <br/>
                <label htmlFor="recipie-timeframe">About how long will this take to cook?</label>
                <input type="text" name="recipie-timeframe" id="recipie-timeframe" />
                <br/>
                <label htmlFor='recipie-servings'>Serves</label>
                <input type="text" name="recipie-servings" id="recipie-servings" />
                <br/>
                <label htmlFor="recipie-instructions">Method</label>
                <input type="text" name="recipie-instructions" id="instructions" />
                <br/>
                <input type="submit" name="submit-recipie" id="submit-recipie" />
            </form>
        </div>
    );
}

export default AddRecipiePage;
