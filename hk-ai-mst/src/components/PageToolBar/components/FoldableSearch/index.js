// 库引入
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Icon, Form, AutoComplete, Input } from 'antd';
import { observable, action } from 'mobx';
import QueueAnim from 'rc-queue-anim';

// utils引入
import { f } from '../../../../utils/f2f';

// 样式引入
import styles from './style.module.less';

// 一些值
const { Item: FormItem } = Form;

@Form.create()
@observer
class FoldableSearch extends Component {

  state = {
    formHidden: true
  }

  // 指示输入框是否隐藏
  @observable formHidden = false;

  // 切换输入框显示状态
  @action toggleFormHidden = () => {
    this.formHidden = !this.formHidden;
  }

  // 提交表单的方法
  @action handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of foldableSearch\' form: ', values);
        this.formHidden(false);
        this.props.onSubmit(values.searchFilter);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={ classNames(styles.foldableSearch, this.props.className) } style={ this.props.style }>
        <Icon
          className={ classNames(styles.searchIcon) }
          type="search"
          theme="outlined"
          onClick={ this.toggleFormHidden } />
        <QueueAnim
          animConfig={ {
            width: [174, 0]
          } }>
          { this.formHidden ?
            (
              <div key="queueAnim1" style={{overflowX: 'hidden'}}>
                <Form
                  className={ classNames(styles.form) }
                  onSubmit={ this.handleSubmit }>
                  <FormItem>
                    { getFieldDecorator('searchFilter', {})(
                      <AutoComplete
                        dataSource={ this.props.autoCompleteDataSource }
                        className={ classNames(styles.autoComplete) }
                        placeholder="站内搜索">
                        <Input />
                      </AutoComplete>
                    ) }
                  </FormItem>
                </Form>
              </div>
            ) : null }
        </QueueAnim>
      </div>
    );
  }
}

FoldableSearch.defaultProps = {
  // 下拉选项
  autoCompleteDataSource: ['选项一', '选项二', '选项三'],
  // 数据验证成功后回调事件
  onSubmit: f
};

const InjectFoldableSearch = inject(({ someStore = {} }) => ({ someProps: someStore.attribute }))(FoldableSearch);

export {
  FoldableSearch,
  InjectFoldableSearch
};