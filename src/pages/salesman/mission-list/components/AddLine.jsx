import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const AddLine = props => {
  return (
    <div>
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field,index) => {
              index = index+1;
              let flag = index+1;
              return ( <div key={field.key}>
                <Form.Item
                  {...field}
                  label={`D${flag}中餐`}
                  name={[field.name, 'first']}
                  fieldKey={[field.fieldKey, 'first']}
                >
                  <Input placeholder="请输入中餐内容" />
                </Form.Item>
                <Form.Item
                  {...field}
                  label={`D${flag}晚餐`}
                  name={[field.name, 'last']}
                  fieldKey={[field.fieldKey, 'last']}
                >
                  <Input placeholder="请输入晚餐内容" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </div>)
            })}
            <Form.Item label=" ">
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加用餐安排
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
}
export default AddLine;
