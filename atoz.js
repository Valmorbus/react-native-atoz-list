import React, { Component } from 'react';
import { View, Text, PanResponder } from 'react-native';



class Letter extends Component {

  render() {
    return (
      <Text style={[BaseStyle.regular,{  fontWeight: 'bold', color: '#F860C2' }, this.props.selected ? { fontSize:25, margin: 0 }:{}]}>
        {this.props.letter}
      </Text>
    );
  }
}

const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split('');
export default class AlphabetPicker extends Component {
  constructor(props, context) {
    super(props, context);
    if(props.alphabet){
      Alphabet = props.alphabet;
    }

    this.state = {
      selected: '',
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.props.onTouchStart && this.props.onTouchStart();

        this.tapTimeout = setTimeout(() => {
          this._onTouchLetter(this._findTouchedLetter(gestureState.y0));
        }, 100);
      },
      onPanResponderMove: (evt, gestureState) => {
        clearTimeout(this.tapTimeout);
        this._onTouchLetter(this._findTouchedLetter(gestureState.moveY));
      },
      onPanResponderTerminate: this._onPanResponderEnd.bind(this),
      onPanResponderRelease: this._onPanResponderEnd.bind(this),
    });
  }

  _onTouchLetter(letter) {
    letter && this.props.onTouchLetter && this.props.onTouchLetter(letter);
    if (letter) {
      this.setState({ selected: letter });
    }
  }

  _onPanResponderEnd() {
    requestAnimationFrame(() => {
      this.props.onTouchEnd && this.props.onTouchEnd();
      this.setState({ selected: '' });
    });
  }

  _findTouchedLetter(y) {
    let top = y - (this.absContainerTop || 0);

    if (top >= 1 && top <= this.containerHeight) {
      return Alphabet[Math.floor((top / this.containerHeight) * Alphabet.length)];
    }
  }

  _onLayout = (e) => {
    this.refs.alphabetContainer.measure((x1, y1, width, height, px, py) => {
      this.absContainerTop = py;
      this.containerHeight = height;
    });
  }

  render() {
    let letters =  (
            Alphabet.map((letter) => <Letter letter={letter} key={letter} selected={this.state.selected === letter}/>)
        );

    return (
            <View
                ref='alphabetContainer'
                {...this._panResponder.panHandlers}
                onLayout={this._onLayout}
                style={{ paddingLeft: 5, backgroundColor: '#fff', borderRadius: 1, justifyContent: 'center' }}>
                <View>
                  {letters}
                </View>
            </View>
    );
  }

}
