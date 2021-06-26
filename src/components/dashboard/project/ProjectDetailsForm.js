import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {DatePicker} from "@material-ui/lab";
import {
  Box,
  Button,
  Paper,
  Chip,
  FormHelperText,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';
import { updateProjectDetails } from '../../../slices/project'
import { useDispatch, useSelector } from '../../../store';

const ProjectDetailsForm = (props) => {
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');
  const dispatch = useDispatch();
  const { name, tags, startDate, endDate } = useSelector((state) => state.project);

  return (
    <Formik
      initialValues={{
        projectName: name,
        tags: tags,
        startDate: startDate,
        endDate: endDate,
      }}
      validationSchema={Yup
        .object()
        .shape({
          projectName: Yup
            .string()
            .max(255)
            .required('Required'),
          tags: Yup.array(),
          startDate: Yup.date(),
          endDate: Yup.date()
        })}
      onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
        try {
          dispatch(updateProjectDetails(
                values.projectName,
                values.tags,
                values.startDate,
                values.endDate
              ));

          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        submitCount,
        setFieldValue,
        setFieldTouched,
        touched,
        values
      }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          {...other}
        >
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Project details
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(submitCount > 0 && errors.projectName)}
                fullWidth
                label="Project Name"
                name="projectName"
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                value={values.projectName}
                variant="outlined"
              />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
                <TextField
                  fullWidth
                  label="Tags"
                  name="tags"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => setTag(event.target.value)}
                  value={tag}
                  variant="outlined"
                />
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={() => {
                    if (!tag) {
                      return;
                    }

                    setFieldValue('tags', [
                      ...values.tags,
                      tag
                    ]);
                    setTag('');
                  }}
                >
                  <PlusIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values.tags.map((_tag, i) => (
                  <Chip
                    onDelete={() => {
                      const newTags = values.tags.filter((t) => t !== _tag);

                      setFieldValue('tags', newTags);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={_tag}
                    sx={{
                      '& + &': {
                        ml: 1
                      }
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
              {Boolean(touched.tags && errors.tags) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.tags}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  mt: 4
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <DatePicker
                    label="Start Date"
                    onAccept={() => setFieldTouched('startDate')}
                    onChange={(date) => setFieldValue('startDate', date)}
                    onClose={() => setFieldTouched('startDate')}
                    renderInput={(inputProps) => (
                      <TextField
                        {...inputProps}
                        helperText={null}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={Boolean(submitCount > 0 && errors.startDate)}
                      />
                      )}
                    value={values.startDate}
                  />
                </Box>
                <DatePicker
                  label="End Date"
                  onAccept={() => setFieldTouched('endDate')}
                  onChange={(date) => setFieldValue('endDate', date)}
                  onClose={() => setFieldTouched('endDate')}
                  renderInput={(inputProps) => (
                    <TextField
                      {...inputProps}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={null}
                      error={Boolean(submitCount > 0 && errors.endDate)}
                    />
                  )}
                  value={values.endDate}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                mt: 6
              }}
            >
              {onBack && (
                <Button
                  color="primary"
                  onClick={onBack}
                  size="large"
                  variant="text"
                >
                  Previous
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
                size="large"
              >
                Next
              </Button>
            </Box>
          </Paper>
        </form>
      )}
    </Formik>
  );
};

ProjectDetailsForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default ProjectDetailsForm;
