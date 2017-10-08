/**
 * @flow
 */
import React, { Component } from 'react';
import {
  View,
  SectionList,
  Platform,
} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

type Props = {

};
type State = {

}

export class AlphabetList extends Component<Props, State> {

  sectionList: any;
  getItemLayout: any;

  constructor(props: Props) {
    super(props);

    this.state={
      availableIndexes: [],
      dataList: [],
    };

    this.getItemLayout = sectionListGetItemLayout({
      getItemHeight: (rowData, sectionIndex, rowIndex) => sectionIndex === 0 ? 100 : 50,
      // These three properties are optional
    //  getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 20, // The height of your section headers
    //  getSectionFooterHeight: () => 20, // The height of your section footers
    });
  }

  componentWillMount() {
    this.orderPropsAlphabeticly();
  }

  getChildren(items:any) {
    let arr = [];

    for (let item in items) {
    //  arr = arr.concat(items[item].tags);
    //  this.flattendOurPolitics.push(items[item]);

      if (items[item].children && items[item].children.length>0) {
        arr = arr.concat(this.getChildren(items[item].children));
      }
    }

    return arr;
  }

  setAvailableIndexes(arr:any) {
    this.setState({ availableIndexes: arr.map(item => item.header.substring(0,1)).join('') });
  }
  //WIP
  orderPropsAlphabeticly() {
    let collected = this.props.dataSource;
    let sorted = collected.sort((a, b) => a.header.localeCompare(b.header, 'sv', { sensitivity: 'base' }));
    let arr = sorted.map((item) => {
      let data = item.map((item) => item.children.map((child, index) => child));

      return {
        data: (data),
        header: item.header,
        key: item.header
      };
    });

    this.setAvailableIndexes(arr);
    this.setState({ dataList: arr });
  }
/*
  renderSectionHeaders = (title:string) => (
    <View style={[StartPageInMediaStyle.wrapper, BaseStyle.row]}>

    </View>
  ); */

  _onTouchLetter = (letter) => {
    if ( this.state.uniqIndexes.indexOf(letter) !== -1) {
      let index = this.state.availableIndexes.indexOf(letter);
      this.sectionList.scrollToLocation({ itemIndex: -1, sectionIndex: index, animated: this.props.animated });
    }
  }


  render():any {
    return (
      <View style={[this.props.style || {flex: 1}]}>
      <SectionList
        ref={sectionList => this.sectionList = sectionList}
        sections={this.state.dataList}
        getItemLayout={this.getItemLayout}
        />
        <View style={[{ backgroundColor: '#FFFFFF00', justifyContent: 'center', width: 30, }, Platform.OS === 'ios' ? { marginLeft: 20, marginRight: -30 } : {}]}>
          <AlphabetPicker color={this.props.letterColor} onTouchLetter={this._onTouchLetter}/>
        </View>
      </View>
    );
  }
}
