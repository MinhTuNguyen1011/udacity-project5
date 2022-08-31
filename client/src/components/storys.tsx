import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createstory, deletestory, getstorys, patchstory } from '../api/storys-api'
import Auth from '../auth/Auth'
import { story } from '../types/story'

interface storysProps {
  auth: Auth
  history: History
}

interface storysState {
  storys: story[]
  newstoryName: string
  loadingstorys: boolean
}

export class Storys extends React.PureComponent<storysProps, storysState> {
  state: storysState = {
    storys: [],
    newstoryName: '',
    loadingstorys: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newstoryName: event.target.value })
  }

  onEditButtonClick = (storyId: string) => {
    this.props.history.push(`/storys/${storyId}/edit`)
  }

  onstoryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newstory = await createstory(this.props.auth.getIdToken(), {
        name: this.state.newstoryName,
        dueDate
      })
      this.setState({
        storys: [...this.state.storys, newstory],
        newstoryName: ''
      })
    } catch {
      alert('story creation failed')
    }
  }

  onstoryDelete = async (storyId: string) => {
    try {
      await deletestory(this.props.auth.getIdToken(), storyId)
      this.setState({
        storys: this.state.storys.filter(story => story.storyId !== storyId)
      })
    } catch {
      alert('story deletion failed')
    }
  }

  onstoryCheck = async (pos: number) => {
    try {
      const story = this.state.storys[pos]
      await patchstory(this.props.auth.getIdToken(), story.storyId, {
        name: story.name,
        dueDate: story.dueDate,
        done: !story.done
      })
      this.setState({
        storys: update(this.state.storys, {
          [pos]: { done: { $set: !story.done } }
        })
      })
    } catch {
      alert('story deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const storys = await getstorys(this.props.auth.getIdToken())
      this.setState({
        storys,
        loadingstorys: false
      })
    } catch (e) {
      alert(`Failed to fetch storys: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">storys</Header>

        {this.renderCreatestoryInput()}

        {this.renderstorys()}
      </div>
    )
  }

  renderCreatestoryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onstoryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderstorys() {
    if (this.state.loadingstorys) {
      return this.renderLoading()
    }

    return this.renderstorysList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading storys
        </Loader>
      </Grid.Row>
    )
  }

  renderstorysList() {
    return (
      <Grid padded>
        {this.state.storys.map((story, pos) => {
          return (
            <Grid.Row key={story.storyId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onstoryCheck(pos)}
                  checked={story.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {story.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {story.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(story.storyId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onstoryDelete(story.storyId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {story.attachmentUrl && (
                <Image src={story.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
