import { Button, Checkbox, Input, Radio, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiTrashAlt } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { mapEnumConstantToArray } from '../../utils/enum-constant.util.js';

const Question = ({ question, keyAnswer: key, onChange }) => {
    const questionTypes = useSelector((state) => state.config.questionTypes);
    const questionTypeOptions = useMemo(() => mapEnumConstantToArray(questionTypes), [questionTypes]);

    const handleChange = (question, key) => {
        if (question.type === 3) {
            delete question.answers;
        } else {
            question.answers ||= [];
            question.answers = question.answers.map((a, i) => ({ ...a, answerId: i + 1 }));
        }
        onChange(question, key);
    };

    const handleQuestionChange = (q) => {
        question.question = q;
        handleChange(question, key);
    };

    const handleChangeType = (type) => {
        question.type = type;
        handleChange(question, key);
    };

    const handleAddAnswer = () => {
        question.answers.push({ label: '' });
        handleChange(question, key);
    };

    const handleUpdateAnswer = (index, label) => {
        question.answers[index] = { label };
        handleChange(question, key);
    };

    const handleRemoveAnswer = (index) => {
        question.answers.splice(index, 1);
        handleChange(question, {});
    };

    const handleKeyChange = (key) => {
        handleChange(question, key);
    };

    return (
        <div className="border-[#ccc] border-1 border-solid rounded-8 p-3 mt-1">
            <Select value={question.type} options={questionTypeOptions} onChange={handleChangeType} />
            <Input.TextArea
                className="mt-4"
                placeholder="Câu hỏi"
                value={question.question}
                rows={2}
                onChange={(e) => handleQuestionChange(e.target.value)}
            />
            {question.type === 1 && (
                <>
                    {question.answers.length > 0 && (
                        <Radio.Group
                            className="w-full"
                            value={key.answerId}
                            onChange={(e) =>
                                handleKeyChange({
                                    answerId: e.target.value,
                                })
                            }
                        >
                            {question.answers.map((a, i) => (
                                <div key={i} className="flex mt-1 items-center">
                                    <Radio className="mr-2" value={i + 1} />
                                    <Input
                                        value={a.label}
                                        onChange={(e) => handleUpdateAnswer(i, e.target.value)}
                                        placeholder="Nhập phương án"
                                    />
                                    <IoMdClose className="ml-2 text-20" onClick={() => handleRemoveAnswer(i)} />
                                </div>
                            ))}
                        </Radio.Group>
                    )}
                    <Button onClick={handleAddAnswer} className="mt-4">
                        Thêm phương án
                    </Button>
                </>
            )}
            {question.type === 2 && (
                <>
                    {question.answers.length > 0 && (
                        <Checkbox.Group
                            value={key.answerIds}
                            className="w-full flex flex-col"
                            onChange={(answerIds) => {
                                handleKeyChange({ answerIds });
                            }}
                        >
                            {question.answers.map((a, i) => (
                                <div key={i} className="w-full flex mt-1 items-center">
                                    <Checkbox className="mr-2" value={i + 1} />
                                    <Input
                                        value={a.label}
                                        onChange={(e) => handleUpdateAnswer(i, e.target.value)}
                                        placeholder="Nhập phương án"
                                    />
                                    <IoMdClose className="ml-2 text-20" onClick={() => handleRemoveAnswer(i)} />
                                </div>
                            ))}
                        </Checkbox.Group>
                    )}
                    <Button onClick={handleAddAnswer} className="mt-4">
                        Thêm phương án
                    </Button>
                </>
            )}
            {question.type === 3 && (
                <Input
                    className="mt-1"
                    value={key.answer}
                    onChange={(e) => handleKeyChange({ answer: e.target.value })}
                    placeholder="Nhập đáp án"
                />
            )}
        </div>
    );
};

export function QuestionsInput({ value = {}, onChange }) {
    const { questions = [], keys = [] } = value;

    const handleChange = (questions, keys) => {
        onChange?.({
            questions: questions.map((q, i) => ({ questionId: i + 1, ...q })),
            keys: keys.map((k, i) => ({ questionId: i + 1, ...k })),
        });
    };

    const handleAddQuestion = () => {
        questions.push({
            type: 1,
            question: '',
            answers: [],
        });
        keys.push({});
        handleChange(questions, keys);
    };

    const handleUpdateQuestion = (index, question, key) => {
        questions[index] = question;
        keys[index] = key;
        handleChange(questions, keys);
    };

    const handleRemoveQuestion = (index) => {
        questions.splice(index, 1);
        keys.splice(index, 1);
        handleChange(questions, keys);
    };

    return (
        <div className="space-y-3">
            {questions.map((q, i) => (
                <div key={i}>
                    <div className="flex justify-between items-center">
                        <span>Câu {i + 1}</span>
                        <BiTrashAlt className="text-24" onClick={() => handleRemoveQuestion(i)} />
                    </div>
                    <Question
                        question={q}
                        keyAnswer={keys[i]}
                        onChange={(question, key) => handleUpdateQuestion(i, question, key)}
                    />
                </div>
            ))}
            <Button className="mt-3" onClick={handleAddQuestion}>
                Thêm
            </Button>
        </div>
    );
}

export function QuestionInput({ value = {}, onChange }) {
    const [question, setQuestion] = useState(
        value.question ?? {
            questionId: 0,
            type: 1,
            question: '',
            answers: [],
        },
    );
    const [key, setKey] = useState(
        value.key ?? {
            questionId: 0,
        },
    );

    useEffect(() => {
        if (value.question) setQuestion(value.question);
        if (value.key) setKey(value.key);
    }, [value]);

    useEffect(() => {
        onChange({ question, key });
    }, [question, key]);

    return (
        <Question
            question={question}
            keyAnswer={key}
            onChange={(question, key) => {
                setQuestion({ ...question, questionId: 0 });
                setKey({ ...key, questionId: 0 });
            }}
        />
    );
}
