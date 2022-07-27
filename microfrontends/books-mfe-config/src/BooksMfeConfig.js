import React from 'react';

class BooksMfeConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedApiClaim: ''
    };
  }

  handleChangeApiClaim(value) {
    this.setState(prevState => ({
      ...prevState,
      selectedApiClaim: value,
    }));
  }

  render() {
    const { selectedApiClaim } = this.state;
    return (
      <div className="App">
        <label htmlFor="selectedApiClaim">Select the database:</label><br />
        <select id="selectedApiClaim" name="selectedApiClaim" onChange={e => this.handleChangeApiClaim(e.target.value)} defaultValue={selectedApiClaim} required>
          <option value="">Select...</option>
          <option value="books-mysql-api">MySQL</option>
          <option value="books-mysql-postgresql">PostgreSQL</option>
        </select>
      </div>
    );
  }
}

export default BooksMfeConfig;
