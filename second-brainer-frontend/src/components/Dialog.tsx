import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Dropdown from "../icons/Dropdown";
import { addData } from "../utils/fetchData";
import { editContent } from "../utils/fetchData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleDialog } from "../slices/dialogTriggers";
import { clearForm } from "../slices/formData";
import type { RootState } from "../store/store";
import axios from "axios";
import TagTile from "./TagTile";
import toast from "react-hot-toast";
// import { addTags } from "../utils/fetchData";

//too many repetetive code move all interfaces that repeat in a single file
interface formDataType {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

interface responseType {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const variant: Record<string, string> = {
  inp: "bg-transparent border border-black-700 rounded-lg p-3",
  label: "flex flex-col text-black-300 gap-2",
};

const Dialog = () => {
  const dispatch = useDispatch();

  //refs
  const dialogRef = useRef<HTMLDivElement>(null);
  //useState
  const form = useSelector((state: RootState) => state.form);
  const id = useSelector((state: RootState) => state.id.id);
  const [options, setOptions] = useState<boolean>(false);
  const [tagText, setTagText] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [active, setActive] = useState<string>(allTags[0]);
  const [formData, setFormData] = useState<formDataType>({
    title: "",
    description: "",
    link: "",
    tags: [],
  });
  const [edit] = useState(form.title !== "");

  //useEffects
  //to close the dialog when clicked outside
  useEffect(()=>{
    document.addEventListener('mousedown',closeEventHandler);
    return ()=>{
      document.removeEventListener('mousedown',closeEventHandler)
    }
  },[])

  useEffect(() => {
    getTags();
    setAvailableTags(allTags)
  }, [allTags]);
  
  useEffect(() => {
    setFormData({
      ...form,
    });
  }, [form]);
  
  //handlers

  const  closeEventHandler = (e:MouseEvent)=>{
    if(e.target instanceof Node && dialogRef.current && !dialogRef.current.contains(e.target)){
      closeDialog();
    }
  }

  const getTags = () => {
    try {
      axios.get("http://localhost:8000/api/v1/tag/all").then((data) => {
        const tags = data.data.response.map((res: responseType) => {
          return res.text;
        });
        setAllTags(tags);
      });
    } catch (error) {
      console.log(error);
    }
  };


  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!formData.tags.includes(tagText)) {
        //db query will later add functionality to add more tags
        // addTags(tagText);
        setFormData({
          ...formData,
          tags: [...formData.tags, tagText],
        });
        setTagText("");
      } else {
        toast.error(`${tagText} already added`);
      }
    } 
    // Not working as desired so will add later
    // else {
    //   if (tagText === "") {
    //     setAvailableTags(allTags);
    //     return;
    //   }
    //   //Show only those available tags which match the corresponding value in input
    //   const updatedTagsArray = allTags.filter((curr) => {
    //     if (curr.includes(tagText)) return curr;
    //   });
    //   setAvailableTags(updatedTagsArray);
    // }
  };
  const closeDialog = () => {
    dispatch(toggleDialog());
    dispatch(clearForm());
  };

  const addTag = (text: string) => {
    if (formData?.tags?.includes(text)) {
      toast.error(`${text} already added`);
      return;
    }
    const newTagArray = [...formData.tags, text];
    setFormData({
      ...formData,
      tags: newTagArray,
    });
  };

  //ReactQuery Code
  const queryClient = useQueryClient(); //access the query cache
  const mutation = useMutation({
    mutationFn: addData,
    onSuccess: () => {
      //invalidate the users query after a successfull mutation
      queryClient.invalidateQueries();
    },
  });

  const editMutation = useMutation({
    mutationFn: editContent,
    onSuccess: () => {
      //invalidate the users query after a successfull mutation
      queryClient.invalidateQueries();
    },
  });

  return (
    //disable dialog on click outside....
    <div className="h-full w-full backdrop-blur-sm absolute flex items-center justify-center z-50">
      <div className="w-[450px] h-fit border border-black-700 bg-black-900 p-5 rounded-lg" ref={dialogRef}>
        <div className="text-black-300 text-xl mb-3">New content</div>
        <form className="text-sm flex flex-col gap-3">
          <label htmlFor="title" className={variant.label}>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={changeHandler}
              placeholder="Title of the content"
              className={variant.inp}
            />
          </label>
          <label htmlFor="description" className={variant.label}>
            Description
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={changeHandler}
              placeholder="Desc of the content"
              className={variant.inp}
            />
          </label>
          <label htmlFor="link" className={variant.label}>
            Url
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={changeHandler}
              placeholder="Url of the content"
              className={variant.inp}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {formData && formData?.tags?.map((text) => {
              return (
                <TagTile text={text} setFormData={setFormData} key={text} />
              );
            })}
          </div>
          <div
            className="text-black-300 flex items-center border border-black-700 rounded-lg pr-4 relative"
            onClick={() => {
              setOptions(!options);
            }}
          >
            <input
              type="text"
              name="tags"
              value={tagText}
              className="bg-transparent p-3 w-full outline-none"
              placeholder="Select Tags"
              onChange={(e) => {
                setTagText(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <span className="">
              <Dropdown />
            </span>
          </div>

          {options && (
            <div className="p-3 border border-black-700 rounded-lg flex flex-col gap-2 max-h-[175px] overflow-y-scroll scrollbar">
              {availableTags.map((tag, i) => {
                return (
                  <div
                    className={`text-black-300 p-3 rounded-lg ${active === tag && "bg-black-700"}`}
                    onMouseEnter={() => {
                      setActive(tag);
                    }}
                    onClick={() => {
                      addTag(tag);
                    }}
                    key={i}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          )}
          <span className="w-full flex justify-between mt-2">
            <span onClick={closeDialog}>
              <Button text="Cancel" type="secondary" />
            </span>
            {edit ? (
              <span
                onClick={() => {
                  editMutation.mutate({ id, formData });
                  closeDialog();
                }}
              >
                <Button text="Save" />
              </span>
            ) : (
              <span
                onClick={() => {
                  mutation.mutate(formData);
                  closeDialog();
                }}
              >
                <Button text="Submit" />
              </span>
            )}
          </span>
        </form>
      </div>
    </div>
  );
};

export default Dialog;
