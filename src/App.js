import React from 'react';
import { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        language: "Java", // default value
        keyword: "Data" // default value
      },
      result: ""
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    //console.log("value: " + value + " name: " + name)
    var formData = this.state.formData;
    formData[name] = value;
    //console.log("in handleChange: " + formData.language + ' ' + formData.keyword);
    this.setState({
      formData
    });
  }

  handleRecommendClick = (event) => {
    const formData = this.state.formData;
    // console.log(formData.language + ' ' + formData.keyword);
    this.setState({ isLoading: true });
    
    fetch('http://127.0.0.1:5000', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData) // this is sending the data so that request.get_json can have the data
      })
      .then(response => response.json())
      //.then(data => console.log(data))
      .then(response => {
        this.setState({
          result: response,
          isLoading: false
        });
      })
      .catch(error =>{
        console.error("error: ", error);
      });

  }

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  }

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;
    //console.log("render result: " + result);

    // var content = '{"github_repo_url": "https://github.com/qingyuanzhao/2019-nCov-Data", "repo_description": "data for the 2019-ncov outbreak", "topics": "2019ncov", "owner_repo_name": "qingyuanzhao/2019-nCov-Data", "owner_name": "qingyuanzhao", "owner_type": "User", "organization_bio": NaN, "repo_created_day": "2020-01-31", "primary_language_name": "HTML", "license_name": "cc-by-4.0", "is_github_pages": false, "has_readme": true, "has_wiki": true, "has_merged_prs": true, "has_issues": true, "has_contributor_guide": false, "has_code_of_conduct": false, "count_of_public_forks": 9, "count_of_stars": 24, "count_of_watchers": 24, "count_distinct_contributors": 7, "count_contributions": 91, "count_commits": 50, "count_commit_comments": 0, "count_created_issues": 8, "count_pull_requests_created": 3, "count_pull_requests_reviews": 0, "count_comments_on_issues_and_pull_requests": 30, "language": "en", "is_latin_only_characters": true, "repo_description_cleaned": "data for the 2019ncov outbreak", "description_plus_topics": "data for the 2019ncov outbreak 2019ncov HTML"}';
    // var obj = JSON.parse(content.replace(/\bNaN\b/g, "null")); // use this because json can not handle NaN in the string content
    // console.log(obj)
    // before we start actually render data
    // process the data returned because it is messy
    var repos = []
    for(var idx = 0; idx < result.length; idx++){
      var temp = "";
      if(result.charAt(idx) === '{'){
        var left = idx;
        while(idx < result.length && result.charAt(idx) !== '}'){
          idx++;
        }
        var right = idx;
        temp = temp.concat(result.substring(left, right+1))
        repos.push(temp)
      }
    }


    // console.log("repos.length: " + repos.length)
    // repos.forEach(item => console.log(item));

    // now read all repo into json form in an array

    // <h5 id="result">{result}</h5>

    var recommendations = []
    repos.forEach(item => {
      var obj = JSON.parse(item.replace(/\bNaN\b/g, "null"));
      recommendations.push(obj)
    });
    
    // sort retrived repos by the count of stars
    recommendations.sort(function(a, b){return b.count_of_stars - a.count_of_stars}); 
    //recommendations.forEach(item => console.log(item));
    
    
    // push things into a list and render later in the result container below
    const results = []
    results.push(<div><p></p><b>Note: repos below are sorted by count of stars. </b><p></p></div>)
    for (var itemIdx = 0; itemIdx < recommendations.length; itemIdx++) {
      results.push(
        <div>
        <i class="fa fa-github" ></i>
        <a href={recommendations[itemIdx].github_repo_url} > {recommendations[itemIdx].owner_repo_name}</a>
        <Col>{recommendations[itemIdx].repo_description}</Col> 
        <Col><span role="img" aria-label="sheep">&#9734; </span> {recommendations[itemIdx].count_of_stars}</Col>
        <Col> <i class="fa fa-code-fork" aria-hidden="true"></i> {recommendations[itemIdx].count_of_public_forks}</Col>
        <Col> Language: {recommendations[itemIdx].primary_language_name}</Col>
        <Col> Contributors: {recommendations[itemIdx].count_distinct_contributors}</Col>
        <Col> Created: {recommendations[itemIdx].repo_created_day}</Col>
        </div>
        )
    }
    // the languages and keywords are manually chosen here
    var languages = []
    var languageStack = ["Java", "PHP", "Python", "Perl", "JavaScript", "TypeScript", "CSS", "HTML", "Ruby", 
      "Jupyter", "R", "Kotlin", "C++", "C#", "C", "Shell", "Swift", "Rust", "Julia", "ruby", "Go", "Dockerfile", "MATLAB"]
    for (var i = 0; i < languageStack.length; i++) {
      languages.push(<option key = {languageStack[i]} value = {languageStack[i]}>{languageStack[i]}</option>)
    }
     
    var keywords = []
    var keywordsStack = ["Data", "Web", "App", "Crisis", "Graph", "Bot", "Project", "Website", "Help", "Information", 
      "Tracking", "Application", "People", "Analysis", "Country", "State", "Tracker", "Open", "Visualization"]
    for (var j = 0; j < keywordsStack.length; j++) {
      keywords.push(<option key = {keywordsStack[j]} value = {keywordsStack[j]}>{keywordsStack[j]}</option>)
    }

    return (
      <Container>
        <div>
          <h1 className="title">COVID19 GitHub Projects Recommendation System</h1>
          <h5 className="subtitle">Find your aimed project</h5>
        </div>
        <div className="content">
          <Form>
            <Form.Row>
            
              <Form.Group as={Col}>
                <Form.Label>Program Language</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.language}
                  name="language"
                  onChange={this.handleChange}>
                  {languages}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Other Keyword</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.keyword}
                  name="keyword"
                  onChange={this.handleChange}>
                  {keywords}
                </Form.Control>
              </Form.Group>
            </Form.Row>
           
            <Row>
              <Col>
                <Button
                  block
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handleRecommendClick : null}>
                  { isLoading ? 'Making recommendation' : 'Recommend' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}>
                  Reset Recommendation
                </Button>
              </Col>
            </Row>
          </Form>
          
          {result === "" ? null : results}
        </div>
      </Container>
    );
  }
}

export default App;